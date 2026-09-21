import type {
	CourierAvailability,
	ShipmentStatus,
} from "../../../generated/prisma/enums";

export interface IAssignHubAndCourierPayload {
	originHubId: string;
	destinationHubId: string;
	courierId: string;
	deliveryCharge?: number;
}

export interface IRejectShipmentPayload {
	reason: string;
}

export interface IOperationsShipmentFilterQuery {
	status?: ShipmentStatus;
	originHubId?: string;
	destinationHubId?: string;
	searchTerm?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface ICourierFilterQuery {
	hubId?: string;
	availabilityStatus?: CourierAvailability;
	searchTerm?: string;
	page?: number;
	limit?: number;
}
