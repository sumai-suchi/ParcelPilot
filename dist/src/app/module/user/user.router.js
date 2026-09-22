import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
const router = Router();
// ==========================================
// Profile Management
// ==========================================
router.get("/me", auth(), UserController.getProfile);
router.get("/profile", auth(), UserController.getProfile);
router.patch("/profile", auth(), validateRequest(UserValidation.UpdateProfileZodSchema), UserController.updateProfile);
// ==========================================
// Customer Address Management
// ==========================================
router.post("/address", auth(UserRole.CUSTOMER), validateRequest(UserValidation.CreateAddressZodSchema), UserController.addAddress);
router.get("/address", auth(UserRole.CUSTOMER), UserController.getMyAddresses);
router.get("/address/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER), UserController.getAddressById);
router.patch("/address/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), validateRequest(UserValidation.UpdateAddressZodSchema), UserController.updateAddress);
router.delete("/address/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), UserController.deleteAddress);
// Address plural aliases
router.post("/addresses", auth(UserRole.CUSTOMER), validateRequest(UserValidation.CreateAddressZodSchema), UserController.addAddress);
router.get("/addresses", auth(UserRole.CUSTOMER), UserController.getMyAddresses);
router.get("/addresses/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER), UserController.getAddressById);
router.patch("/addresses/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), validateRequest(UserValidation.UpdateAddressZodSchema), UserController.updateAddress);
router.delete("/addresses/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN), UserController.deleteAddress);
// ==========================================
// Customer Shipment Request
// ==========================================
router.post("/shipment-request", auth(UserRole.CUSTOMER), validateRequest(UserValidation.CreateShipmentRequestZodSchema), UserController.createShipmentRequest);
router.post("/create-shipment-request", auth(UserRole.CUSTOMER), validateRequest(UserValidation.CreateShipmentRequestZodSchema), UserController.createShipmentRequest);
router.get("/shipments", auth(UserRole.CUSTOMER), UserController.getMyShipments);
router.get("/shipments/:id", auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.OPERATIONS_MANAGER, UserRole.HUB_MANAGER), UserController.getShipmentById);
// ==========================================
// User Administration
// ==========================================
router.get("/", auth(UserRole.ADMIN, UserRole.OPERATIONS_MANAGER), UserController.getAllUsers);
router.get("/:id", auth(UserRole.ADMIN, UserRole.OPERATIONS_MANAGER), UserController.getUserById);
router.patch("/:id/status", auth(UserRole.ADMIN), validateRequest(UserValidation.UpdateUserStatusZodSchema), UserController.updateUserStatus);
export const UserRoutes = router;
