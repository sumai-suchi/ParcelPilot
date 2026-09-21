import { z } from "zod";

const AssignHubAndCourierZodSchema = z.object({
	originHubId: z.string().uuid("Invalid origin hub ID"),
	destinationHubId: z.string().uuid("Invalid destination hub ID"),
	courierId: z.string().uuid("Invalid courier ID"),
	deliveryCharge: z
		.number()
		.positive("Delivery charge must be positive")
		.optional(),
});

const RejectShipmentZodSchema = z.object({
	reason: z
		.string()
		.min(3, "Rejection reason must be at least 3 characters long")
		.max(500, "Rejection reason cannot exceed 500 characters"),
});

export const OperationsManagerValidation = {
	AssignHubAndCourierZodSchema,
	RejectShipmentZodSchema,
};
