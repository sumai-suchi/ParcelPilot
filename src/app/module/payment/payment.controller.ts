import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	if (!user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"User context missing from request.",
		);
	}

	const { shipmentId } = req.params;
	const result = await PaymentService.createPaymentIntent(
		shipmentId as string,
		user.userId,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Stripe PaymentIntent generated successfully.",
		data: result,
	});
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	if (!user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"User context missing from request.",
		);
	}

	const { shipmentId } = req.params;
	const result = await PaymentService.confirmPayment(
		shipmentId as string,
		user.userId,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Stripe payment confirmed successfully. Shipment marked as PAID.",
		data: result,
	});
});

const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
	const { shipmentId } = req.params;
	const result = await PaymentService.getPaymentStatus(shipmentId as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment status retrieved successfully.",
		data: result,
	});
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"] as string;
	const payload = (req as any).rawBody || req.body;
	const result = await PaymentService.handleWebhook(signature, payload);

	res.status(httpStatus.OK).json(result);
});

export const PaymentController = {
	createPaymentIntent,
	confirmPayment,
	getPaymentStatus,
	handleWebhook,
};
