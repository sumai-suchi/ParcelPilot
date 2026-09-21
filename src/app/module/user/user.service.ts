import crypto from "node:crypto";
import httpStatus from "http-status";
import type { Prisma } from "../../../generated/prisma/client";
import {
	PaymentStatus,
	ShipmentStatus,
	UserRole,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	ICreateAddressPayload,
	ICreateShipmentRequestPayload,
	IShipmentFilterQuery,
	IUpdateAddressPayload,
	IUpdateProfilePayload,
	IUpdateUserStatusPayload,
	IUserFilterQuery,
} from "./user.interface";

/**
 * Helper: Find Customer profile by User ID
 */
const getCustomerByUserId = async (userId: string) => {
	const customer = await prisma.customer.findUnique({
		where: {
			userId,
		},
	});

	if (!customer) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Customer profile not found for this user account.",
		);
	}

	return customer;
};

// ==========================================
// User Profile & Management Services
// ==========================================

const getProfile = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		omit: {
			password: true,
		},
		include: {
			customer: {
				include: {
					addresses: {
						orderBy: {
							createdAt: "desc",
						},
					},
				},
			},
			courier: {
				include: {
					hub: true,
				},
			},
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	return user;
};

const updateProfile = async (
	userId: string,
	payload: IUpdateProfilePayload,
) => {
	const { name, phone } = payload;

	const existingUser = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!existingUser) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	if (phone && phone !== existingUser.phone) {
		const phoneConflict = await prisma.user.findFirst({
			where: {
				phone,
				NOT: {
					id: userId,
				},
			},
		});

		if (phoneConflict) {
			throw new AppError(
				httpStatus.CONFLICT,
				"Phone number is already associated with another account.",
			);
		}
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			...(name ? { name } : {}),
			...(phone ? { phone } : {}),
		},
		omit: {
			password: true,
		},
	});

	return updatedUser;
};

const getAllUsers = async (query: IUserFilterQuery) => {
	const page = Number(query.page) > 0 ? Number(query.page) : 1;
	const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
	const skip = (page - 1) * limit;

	const whereConditions: Prisma.UserWhereInput = {};

	if (query.role) {
		whereConditions.role = query.role;
	}

	if (query.status) {
		whereConditions.status = query.status;
	}

	if (query.searchTerm) {
		whereConditions.OR = [
			{ name: { contains: query.searchTerm, mode: "insensitive" } },
			{ email: { contains: query.searchTerm, mode: "insensitive" } },
			{ phone: { contains: query.searchTerm, mode: "insensitive" } },
		];
	}

	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where: whereConditions,
			skip,
			take: limit,
			orderBy: {
				[sortBy]: sortOrder,
			},
			omit: {
				password: true,
			},
			include: {
				customer: true,
				courier: true,
			},
		}),
		prisma.user.count({
			where: whereConditions,
		}),
	]);

	return {
		data: users,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getUserById = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		omit: {
			password: true,
		},
		include: {
			customer: {
				include: {
					addresses: true,
				},
			},
			courier: {
				include: {
					hub: true,
				},
			},
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	return user;
};

const updateUserStatus = async (
	id: string,
	payload: IUpdateUserStatusPayload,
) => {
	const existingUser = await prisma.user.findUnique({
		where: {
			id,
		},
	});

	if (!existingUser) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	const updatedUser = await prisma.user.update({
		where: {
			id,
		},
		data: {
			...(payload.status ? { status: payload.status } : {}),
			...(payload.role ? { role: payload.role } : {}),
		},
		omit: {
			password: true,
		},
	});

	return updatedUser;
};

// ==========================================
// Customer Address Management Services
// ==========================================

const addAddress = async (userId: string, payload: ICreateAddressPayload) => {
	const customer = await getCustomerByUserId(userId);

	const address = await prisma.address.create({
		data: {
			customerId: customer.id,
			label: payload.label || null,
			addressLine: payload.addressLine,
			city: payload.city,
			area: payload.area,
			postalCode: payload.postalCode || null,
			latitude: payload.latitude !== undefined ? payload.latitude : null,
			longitude: payload.longitude !== undefined ? payload.longitude : null,
		},
	});

	return address;
};

const getMyAddresses = async (userId: string) => {
	const customer = await getCustomerByUserId(userId);

	const addresses = await prisma.address.findMany({
		where: {
			customerId: customer.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return addresses;
};

const getAddressById = async (
	userId: string,
	addressId: string,
	role: UserRole,
) => {
	const address = await prisma.address.findUnique({
		where: {
			id: addressId,
		},
	});

	if (!address) {
		throw new AppError(httpStatus.NOT_FOUND, "Address not found.");
	}

	if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
		const customer = await getCustomerByUserId(userId);
		if (address.customerId !== customer.id) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You do not have access to this address.",
			);
		}
	}

	return address;
};

const updateAddress = async (
	userId: string,
	addressId: string,
	payload: IUpdateAddressPayload,
	role: UserRole,
) => {
	const address = await prisma.address.findUnique({
		where: {
			id: addressId,
		},
	});

	if (!address) {
		throw new AppError(httpStatus.NOT_FOUND, "Address not found.");
	}

	if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
		const customer = await getCustomerByUserId(userId);
		if (address.customerId !== customer.id) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You cannot update an address that does not belong to you.",
			);
		}
	}

	const updatedAddress = await prisma.address.update({
		where: {
			id: addressId,
		},
		data: {
			...(payload.label !== undefined ? { label: payload.label } : {}),
			...(payload.addressLine ? { addressLine: payload.addressLine } : {}),
			...(payload.city ? { city: payload.city } : {}),
			...(payload.area ? { area: payload.area } : {}),
			...(payload.postalCode !== undefined
				? { postalCode: payload.postalCode }
				: {}),
			...(payload.latitude !== undefined ? { latitude: payload.latitude } : {}),
			...(payload.longitude !== undefined
				? { longitude: payload.longitude }
				: {}),
		},
	});

	return updatedAddress;
};

const deleteAddress = async (
	userId: string,
	addressId: string,
	role: UserRole,
) => {
	const address = await prisma.address.findUnique({
		where: {
			id: addressId,
		},
	});

	if (!address) {
		throw new AppError(httpStatus.NOT_FOUND, "Address not found.");
	}

	if (role !== UserRole.ADMIN && role !== UserRole.OPERATIONS_MANAGER) {
		const customer = await getCustomerByUserId(userId);
		if (address.customerId !== customer.id) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You cannot delete an address that does not belong to you.",
			);
		}
	}

	await prisma.address.delete({
		where: {
			id: addressId,
		},
	});

	return { message: "Address deleted successfully." };
};

// ==========================================
// Customer Shipment Request Services
// ==========================================

/**
 * Creates a shipment request for the authenticated Customer.
 * When the customer creates a shipment request, they must fill/add address information
 * which will be saved in the database under that customer.
 */
const createShipmentRequest = async (
	userId: string,
	payload: ICreateShipmentRequestPayload,
) => {
	// 1. Ensure user has an active Customer profile
	const customer = await getCustomerByUserId(userId);

	// 2. Validate pickup address requirement
	if (!payload.pickupAddress && !payload.pickupAddressId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Pickup address is required. Please fill in pickup address details to add the address for your account.",
		);
	}

	// 3. Validate delivery address requirement
	if (!payload.deliveryAddress && !payload.deliveryAddressId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Delivery address is required. Please fill in delivery address details.",
		);
	}

	// 4. Validate existing address IDs if provided
	if (payload.pickupAddressId) {
		const existingPickup = await prisma.address.findUnique({
			where: { id: payload.pickupAddressId },
		});
		if (!existingPickup) {
			throw new AppError(httpStatus.NOT_FOUND, "Pickup address not found.");
		}
		if (existingPickup.customerId !== customer.id) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Specified pickup address does not belong to your account.",
			);
		}
	}

	if (payload.deliveryAddressId) {
		const existingDelivery = await prisma.address.findUnique({
			where: { id: payload.deliveryAddressId },
		});
		if (!existingDelivery) {
			throw new AppError(httpStatus.NOT_FOUND, "Delivery address not found.");
		}
	}

	// 5. Generate Tracking Number: PP-YYYYMMDD-XXXXXX
	const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
	const trackingNumber = `PP-${datePart}-${randomPart}`;

	const deliveryType = payload.deliveryType || "STANDARD";
	const deliveryCharge = 60.0; // Default baseline charge

	// 6. Execute transactional creation
	const result = await prisma.$transaction(async (tx) => {
		// Save pickup address for this customer if address details are filled
		let pickupAddressId: string;
		if (payload.pickupAddress) {
			const createdPickup = await tx.address.create({
				data: {
					customerId: customer.id,
					label: payload.pickupAddress.label || "Pickup Address",
					addressLine: payload.pickupAddress.addressLine,
					city: payload.pickupAddress.city,
					area: payload.pickupAddress.area,
					postalCode: payload.pickupAddress.postalCode || null,
					latitude:
						payload.pickupAddress.latitude !== undefined
							? payload.pickupAddress.latitude
							: null,
					longitude:
						payload.pickupAddress.longitude !== undefined
							? payload.pickupAddress.longitude
							: null,
				},
			});
			pickupAddressId = createdPickup.id;
		} else if (payload.pickupAddressId) {
			pickupAddressId = payload.pickupAddressId;
		} else {
			throw new AppError(httpStatus.BAD_REQUEST, "Pickup address is required.");
		}

		// Save delivery address for this customer if address details are filled
		let deliveryAddressId: string;
		if (payload.deliveryAddress) {
			const createdDelivery = await tx.address.create({
				data: {
					customerId: customer.id,
					label: payload.deliveryAddress.label || "Delivery Address",
					addressLine: payload.deliveryAddress.addressLine,
					city: payload.deliveryAddress.city,
					area: payload.deliveryAddress.area,
					postalCode: payload.deliveryAddress.postalCode || null,
					latitude:
						payload.deliveryAddress.latitude !== undefined
							? payload.deliveryAddress.latitude
							: null,
					longitude:
						payload.deliveryAddress.longitude !== undefined
							? payload.deliveryAddress.longitude
							: null,
				},
			});
			deliveryAddressId = createdDelivery.id;
		} else if (payload.deliveryAddressId) {
			deliveryAddressId = payload.deliveryAddressId;
		} else {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Delivery address is required.",
			);
		}

		// Create Shipment record in PENDING_APPROVAL without assigned hubs
		const createdShipment = await tx.shipment.create({
			data: {
				trackingNumber,
				customerId: customer.id,
				pickupAddressId,
				deliveryAddressId,
				originHubId: null,
				destinationHubId: null,
				parcelType: payload.parcelType,
				weight: payload.weight,
				description: payload.description || null,
				deliveryType,
				deliveryCharge,
				status: ShipmentStatus.PENDING_APPROVAL,
				paymentStatus: PaymentStatus.PENDING,
				scheduledPickupAt: payload.scheduledPickupAt
					? new Date(payload.scheduledPickupAt)
					: null,
			},
			include: {
				pickupAddress: true,
				deliveryAddress: true,
				originHub: true,
				destinationHub: true,
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
			},
		});

		// Create initial status history entry
		await tx.shipmentStatusHistory.create({
			data: {
				shipmentId: createdShipment.id,
				status: ShipmentStatus.PENDING_APPROVAL,
				location: null,
				note: "Shipment request created by customer, awaiting operational review",
				updatedBy: userId,
			},
		});

		return createdShipment;
	});

	return result;
};

const getMyShipments = async (userId: string, query: IShipmentFilterQuery) => {
	const customer = await getCustomerByUserId(userId);

	const page = Number(query.page) > 0 ? Number(query.page) : 1;
	const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
	const skip = (page - 1) * limit;

	const whereConditions: Prisma.ShipmentWhereInput = {
		customerId: customer.id,
	};

	if (query.status) {
		whereConditions.status = query.status as ShipmentStatus;
	}

	const sortBy = query.sortBy || "createdAt";
	const sortOrder = query.sortOrder || "desc";

	const [shipments, total] = await Promise.all([
		prisma.shipment.findMany({
			where: whereConditions,
			skip,
			take: limit,
			orderBy: {
				[sortBy]: sortOrder,
			},
			include: {
				pickupAddress: true,
				deliveryAddress: true,
				originHub: true,
				destinationHub: true,
				statusHistory: {
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		}),
		prisma.shipment.count({
			where: whereConditions,
		}),
	]);

	return {
		data: shipments,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getShipmentById = async (
	userId: string,
	shipmentId: string,
	role: UserRole,
) => {
	const shipment = await prisma.shipment.findUnique({
		where: {
			id: shipmentId,
		},
		include: {
			pickupAddress: true,
			deliveryAddress: true,
			originHub: true,
			destinationHub: true,
			statusHistory: {
				orderBy: {
					createdAt: "asc",
				},
			},
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
		},
	});

	if (!shipment) {
		throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
	}

	if (
		role !== UserRole.ADMIN &&
		role !== UserRole.OPERATIONS_MANAGER &&
		role !== UserRole.HUB_MANAGER
	) {
		const customer = await getCustomerByUserId(userId);
		if (shipment.customerId !== customer.id) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You do not have permission to view this shipment.",
			);
		}
	}

	return shipment;
};

export const UserService = {
	getProfile,
	updateProfile,
	getAllUsers,
	getUserById,
	updateUserStatus,
	addAddress,
	getMyAddresses,
	getAddressById,
	updateAddress,
	deleteAddress,
	createShipmentRequest,
	getMyShipments,
	getShipmentById,
};
