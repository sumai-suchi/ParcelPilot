import { z } from "zod";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
const CreateAddressZodSchema = z.object({
    label: z.string().max(50).optional(),
    addressLine: z.string().min(1, "Address line is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    postalCode: z.string().max(20).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
const UpdateAddressZodSchema = z.object({
    label: z.string().max(50).optional(),
    addressLine: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    area: z.string().min(1).optional(),
    postalCode: z.string().max(20).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
const UpdateProfileZodSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(100)
        .optional(),
    phone: z
        .string()
        .min(6, "Phone must be at least 6 characters")
        .max(50)
        .optional(),
});
const UpdateUserStatusZodSchema = z.object({
    status: z
        .nativeEnum(UserStatus, {
        message: "Invalid user status",
    })
        .optional(),
    role: z
        .nativeEnum(UserRole, {
        message: "Invalid user role",
    })
        .optional(),
});
const CreateShipmentRequestZodSchema = z.object({
    pickupAddress: CreateAddressZodSchema.optional(),
    pickupAddressId: z.string().uuid("Invalid pickup address ID").optional(),
    deliveryAddress: CreateAddressZodSchema.optional(),
    deliveryAddressId: z.string().uuid("Invalid delivery address ID").optional(),
    parcelType: z.string().min(1, "Parcel type is required"),
    weight: z.number().positive("Weight must be a positive number"),
    description: z.string().optional(),
    deliveryType: z.string().optional().default("STANDARD"),
    scheduledPickupAt: z.string().optional(),
});
export const UserValidation = {
    CreateAddressZodSchema,
    UpdateAddressZodSchema,
    UpdateProfileZodSchema,
    UpdateUserStatusZodSchema,
    CreateShipmentRequestZodSchema,
};
