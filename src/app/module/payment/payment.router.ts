import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

// ==========================================
// Stripe Customer/Courier Payment Endpoints
// ==========================================

router.post(
	"/create-payment-intent/:shipmentId",
	auth(
		UserRole.CUSTOMER,
		UserRole.COURIER,
		UserRole.ADMIN,
		UserRole.OPERATIONS_MANAGER,
	),
	validateRequest(PaymentValidation.CreatePaymentIntentZodSchema),
	PaymentController.createPaymentIntent,
);

router.post(
	"/confirm/:shipmentId",
	auth(
		UserRole.CUSTOMER,
		UserRole.COURIER,
		UserRole.ADMIN,
		UserRole.OPERATIONS_MANAGER,
	),
	validateRequest(PaymentValidation.ConfirmPaymentZodSchema),
	PaymentController.confirmPayment,
);

router.get("/status/:shipmentId", auth(), PaymentController.getPaymentStatus);

// ==========================================
// Stripe Automated Webhook
// ==========================================
router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	PaymentController.handleWebhook,
);

export const PaymentRoutes = router;
