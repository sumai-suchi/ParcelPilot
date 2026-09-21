import type { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface ICreateAddressPayload {
	label?: string;
	addressLine: string;
	city: string;
	area: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
}

export interface IUpdateAddressPayload {
	label?: string;
	addressLine?: string;
	city?: string;
	area?: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
}

export interface IUpdateProfilePayload {
	name?: string;
	phone?: string;
}

export interface IUpdateUserStatusPayload {
	status?: UserStatus;
	role?: UserRole;
}

export interface IUserFilterQuery {
	searchTerm?: string;
	role?: UserRole;
	status?: UserStatus;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface ICreateShipmentRequestPayload {
	pickupAddress?: ICreateAddressPayload;
	pickupAddressId?: string;
	deliveryAddress?: ICreateAddressPayload;
	deliveryAddressId?: string;
	parcelType: string;
	weight: number;
	description?: string;
	deliveryType?: string;
	scheduledPickupAt?: string | Date;
}

export interface IShipmentFilterQuery {
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
