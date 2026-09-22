import httpStatus from "http-status";
import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	IConfirmPaymentPayload,
	ICreatePaymentIntentPayload,
} from "./payment.interface";

// Initialize official Stripe client
const stripe = new Stripe(config.stripe_secret_key || "");

/**
 * Creates a Stripe PaymentIntent for the shipment's delivery charge
 */
const createPaymentIntent = async (
	shipmentId: string,
	userId: string,
	payload?: ICreatePaymentIntentPayload,
) => {
	const shipment = await prisma.shipment.findUnique({
		where: { id: shipmentId },
		include: {
			customer: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
						},
					},
				},
			},
			payment: true,
		},
	});

	if (!shipment) {
		throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
	}

	if (shipment.paymentStatus === PaymentStatus.PAID) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"This shipment has already been paid for.",
		);
	}

	const deliveryCharge = Number(shipment.deliveryCharge) || 60.0;
	const currency = (
		payload?.currency ||
		config.stripe_currency ||
		"bdt"
	).toLowerCase();

	// Convert to smallest currency unit (e.g., paisa / cents)
	const amountInSubunits = Math.round(deliveryCharge * 100);

	let paymentIntent: Stripe.PaymentIntent;

	try {
		paymentIntent = await stripe.paymentIntents.create({
			amount: amountInSubunits,
			currency,
			description: `Delivery charge for ParcelPilot shipment ${shipment.trackingNumber}`,
			metadata: {
				shipmentId,
				trackingNumber: shipment.trackingNumber,
				customerName: shipment.customer.user.name,
				customerEmail: shipment.customer.user.email,
				initiatedBy: userId,
			},
			automatic_payment_methods: {
				enabled: true,
			},
		});
	} catch (error: any) {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			`Stripe PaymentIntent creation failed: ${error.message}`,
		);
	}

	// Upsert local Payment record with PENDING status
	await prisma.payment.upsert({
		where: { shipmentId },
		update: {
			amount: deliveryCharge,
			currency: currency.toUpperCase(),
			provider: "STRIPE",
			transactionId: paymentIntent.id,
			status: PaymentStatus.PENDING,
		},
		create: {
			shipmentId,
			amount: deliveryCharge,
			currency: currency.toUpperCase(),
			provider: "STRIPE",
			transactionId: paymentIntent.id,
			status: PaymentStatus.PENDING,
		},
	});

	return {
		clientSecret: paymentIntent.client_secret,
		paymentIntentId: paymentIntent.id,
		amount: deliveryCharge,
		currency: currency.toUpperCase(),
		trackingNumber: shipment.trackingNumber,
		publishableKey: config.stripe_publishable_key,
	};
};

/**
 * Confirm payment status directly against Stripe API and update shipment status
 */
const confirmPayment = async (
	shipmentId: string,
	userId: string,
	payload: IConfirmPaymentPayload,
) => {
	const shipment = await prisma.shipment.findUnique({
		where: { id: shipmentId },
		include: { payment: true },
	});

	if (!shipment) {
		throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
	}

	let paymentIntent: Stripe.PaymentIntent;

	try {
		paymentIntent = await stripe.paymentIntents.retrieve(
			payload.paymentIntentId,
		);
	} catch (error: any) {
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			`Failed to retrieve PaymentIntent from Stripe: ${error.message}`,
		);
	}

	if (paymentIntent.status === "requires_payment_method") {
		try {
			paymentIntent = await stripe.paymentIntents.confirm(
				payload.paymentIntentId,
				{
					payment_method: payload.paymentMethodId || "pm_card_visa",
					return_url: config.frontend_url || "http://localhost:5000",
				},
			);
		} catch (error: any) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				`Failed to process payment on Stripe: ${error.message}`,
			);
		}
	}

	if (paymentIntent.status !== "succeeded") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`Payment has not succeeded yet on Stripe (Current status: ${paymentIntent.status}).`,
		);
	}

	const result = await prisma.$transaction(async (tx) => {
		// Update Payment record
		const updatedPayment = await tx.payment.upsert({
			where: { shipmentId },
			update: {
				status: PaymentStatus.PAID,
				paidAt: new Date(),
				transactionId: paymentIntent.id,
				provider: "STRIPE",
			},
			create: {
				shipmentId,
				amount: shipment.deliveryCharge,
				currency: paymentIntent.currency.toUpperCase(),
				status: PaymentStatus.PAID,
				paidAt: new Date(),
				transactionId: paymentIntent.id,
				provider: "STRIPE",
			},
		});

		// Update Shipment paymentStatus
		const updatedShipment = await tx.shipment.update({
			where: { id: shipmentId },
			data: {
				paymentStatus: PaymentStatus.PAID,
			},
			include: {
				payment: true,
				pickupAddress: true,
				deliveryAddress: true,
			},
		});

		// Add status history
		await tx.shipmentStatusHistory.create({
			data: {
				shipmentId,
				status: shipment.status,
				note: `Payment of ${shipment.deliveryCharge} ${paymentIntent.currency.toUpperCase()} completed successfully via Stripe (ID: ${paymentIntent.id}).`,
				updatedBy: userId,
			},
		});

		return {
			shipment: updatedShipment,
			payment: updatedPayment,
		};
	});

	return result;
};

/**
 * Get real-time payment status of a shipment
 */
const getPaymentStatus = async (shipmentId: string) => {
	const shipment = await prisma.shipment.findUnique({
		where: { id: shipmentId },
		include: {
			payment: true,
		},
	});

	if (!shipment) {
		throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
	}

	return {
		shipmentId: shipment.id,
		trackingNumber: shipment.trackingNumber,
		deliveryCharge: shipment.deliveryCharge,
		paymentStatus: shipment.paymentStatus,
		payment: shipment.payment,
	};
};

/**
 * Handle Stripe webhook events for automated reconciliation
 */
const handleWebhook = async (signature: string, payload: Buffer) => {
	if (!config.stripe_webhook_secret) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Stripe webhook secret is not configured.",
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			payload,
			signature,
			config.stripe_webhook_secret,
		);
	} catch (error: any) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`Webhook signature verification failed: ${error.message}`,
		);
	}

	if (event.type === "payment_intent.succeeded") {
		const paymentIntent = event.data.object as Stripe.PaymentIntent;
		const shipmentId = paymentIntent.metadata?.shipmentId;

		if (shipmentId) {
			await prisma.$transaction(async (tx) => {
				await tx.payment.upsert({
					where: { shipmentId },
					update: {
						status: PaymentStatus.PAID,
						paidAt: new Date(),
						transactionId: paymentIntent.id,
						provider: "STRIPE",
					},
					create: {
						shipmentId,
						amount: paymentIntent.amount / 100,
						currency: paymentIntent.currency.toUpperCase(),
						status: PaymentStatus.PAID,
						paidAt: new Date(),
						transactionId: paymentIntent.id,
						provider: "STRIPE",
					},
				});

				await tx.shipment.update({
					where: { id: shipmentId },
					data: {
						paymentStatus: PaymentStatus.PAID,
					},
				});
			});
		}
	}

	return { received: true };
};

export const PaymentService = {
	createPaymentIntent,
	confirmPayment,
	getPaymentStatus,
	handleWebhook,
};
