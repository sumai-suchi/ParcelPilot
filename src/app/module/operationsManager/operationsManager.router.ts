import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { OperationsManagerController } from "./operationsManager.controller";
import { OperationsManagerValidation } from "./operationsManager.validation";

const router = Router();

// Protect all operations manager routes with OPERATIONS_MANAGER and ADMIN roles
router.use(auth(UserRole.OPERATIONS_MANAGER, UserRole.ADMIN));

// ==========================================
// Operational Shipment Review & Routing
// ==========================================
router.get("/shipments", OperationsManagerController.getAllShipments);
router.get("/shipments/:id", OperationsManagerController.getShipmentDetails);
router.patch(
	"/shipments/:id/assign",
	validateRequest(OperationsManagerValidation.AssignHubAndCourierZodSchema),
	OperationsManagerController.assignHubAndCourier,
);
router.patch(
	"/shipments/:id/reject",
	validateRequest(OperationsManagerValidation.RejectShipmentZodSchema),
	OperationsManagerController.rejectShipment,
);

// ==========================================
// Logistics Resources Lookup
// ==========================================
router.get("/couriers", OperationsManagerController.getCouriers);
router.get("/hubs", OperationsManagerController.getHubs);

export const OperationsManagerRoutes = router;
