import { Router } from "express";
import { validateRequest } from "../../middleware/validationRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";


const router = Router();

router.post(
	"/register",
	validateRequest(UserValidation.CustomerRegistrationZodSchema),

	AuthController.registerCustomerController,
);

router.post(
	"/verify-email",
	validateRequest(UserValidation.CustomerEmailVerifyZodSchema),
	AuthController.verifyCustomerEmailController,
);


export const AuthRoutes = router;
