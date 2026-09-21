import httpStatus from "http-status";
import { AssignmentStatus, ShipmentStatus, } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
// ==========================================
// Shipment Management Services
// ==========================================
const getAllShipments = async (query) => {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const whereConditions = {};
    if (query.status) {
        whereConditions.status = query.status;
    }
    if (query.originHubId) {
        whereConditions.originHubId = query.originHubId;
    }
    if (query.destinationHubId) {
        whereConditions.destinationHubId = query.destinationHubId;
    }
    if (query.searchTerm) {
        whereConditions.OR = [
            { trackingNumber: { contains: query.searchTerm, mode: "insensitive" } },
            {
                customer: {
                    user: {
                        OR: [
                            { name: { contains: query.searchTerm, mode: "insensitive" } },
                            { phone: { contains: query.searchTerm, mode: "insensitive" } },
                            { email: { contains: query.searchTerm, mode: "insensitive" } },
                        ],
                    },
                },
            },
        ];
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
                customer: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                                email: true,
                            },
                        },
                    },
                },
                courierAssignments: {
                    include: {
                        courier: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
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
const getShipmentDetails = async (shipmentId) => {
    const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
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
                            phone: true,
                            email: true,
                        },
                    },
                },
            },
            courierAssignments: {
                include: {
                    courier: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    phone: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            },
            statusHistory: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    if (!shipment) {
        throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
    }
    return shipment;
};
/**
 * Operations Manager flow:
 * 1. Decides Origin Hub based on pickup address
 * 2. Decides Destination Hub based on delivery address
 * 3. Assigns Courier rider -> moves status to COURIER_ASSIGNED
 */
const assignHubAndCourier = async (managerUserId, shipmentId, payload) => {
    const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
        include: { pickupAddress: true, deliveryAddress: true },
    });
    if (!shipment) {
        throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
    }
    if (shipment.status !== ShipmentStatus.PENDING_APPROVAL &&
        shipment.status !== ShipmentStatus.CREATED) {
        throw new AppError(httpStatus.BAD_REQUEST, `Shipment is currently in '${shipment.status}' status and cannot be assigned hubs or courier.`);
    }
    const originHub = await prisma.hub.findUnique({
        where: { id: payload.originHubId },
    });
    if (!originHub?.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid or inactive origin hub.");
    }
    const destinationHub = await prisma.hub.findUnique({
        where: { id: payload.destinationHubId },
    });
    if (!destinationHub?.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid or inactive destination hub.");
    }
    const courier = await prisma.courier.findUnique({
        where: { id: payload.courierId },
        include: { user: true },
    });
    if (!courier) {
        throw new AppError(httpStatus.NOT_FOUND, "Courier rider not found.");
    }
    let deliveryCharge = payload.deliveryCharge;
    if (deliveryCharge === undefined) {
        const pricingRule = await prisma.pricingRule.findFirst({
            where: {
                zoneId: originHub.zoneId,
                deliveryType: shipment.deliveryType,
                isActive: true,
            },
        });
        if (pricingRule) {
            const baseCharge = Number(pricingRule.baseCharge);
            const perKgCharge = Number(pricingRule.perKgCharge);
            const minWeight = Number(pricingRule.minWeight);
            const weight = Number(shipment.weight);
            deliveryCharge =
                weight > minWeight
                    ? baseCharge + (weight - minWeight) * perKgCharge
                    : baseCharge;
        }
        else {
            deliveryCharge = Number(shipment.deliveryCharge) || 60.0;
        }
    }
    const result = await prisma.$transaction(async (tx) => {
        const updatedShipment = await tx.shipment.update({
            where: { id: shipmentId },
            data: {
                originHubId: originHub.id,
                destinationHubId: destinationHub.id,
                deliveryCharge,
                status: ShipmentStatus.COURIER_ASSIGNED,
            },
            include: {
                pickupAddress: true,
                deliveryAddress: true,
                originHub: true,
                destinationHub: true,
                courierAssignments: {
                    include: {
                        courier: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        phone: true,
                                        email: true,
                                    },
                                },
                            },
                        },
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
        await tx.courierParcel.create({
            data: {
                shipmentId,
                courierId: courier.id,
                assignedBy: managerUserId,
                status: AssignmentStatus.PENDING,
            },
        });
        await tx.shipmentStatusHistory.create({
            data: {
                shipmentId,
                status: ShipmentStatus.COURIER_ASSIGNED,
                location: originHub.name,
                note: `Assigned origin hub (${originHub.name}), destination hub (${destinationHub.name}), and courier rider (${courier.user.name})`,
                updatedBy: managerUserId,
            },
        });
        return updatedShipment;
    });
    return result;
};
const rejectShipment = async (managerUserId, shipmentId, payload) => {
    const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
    });
    if (!shipment) {
        throw new AppError(httpStatus.NOT_FOUND, "Shipment not found.");
    }
    if (shipment.status !== ShipmentStatus.PENDING_APPROVAL &&
        shipment.status !== ShipmentStatus.CREATED) {
        throw new AppError(httpStatus.BAD_REQUEST, `Shipment is currently in '${shipment.status}' status and cannot be rejected.`);
    }
    const result = await prisma.$transaction(async (tx) => {
        const cancelledShipment = await tx.shipment.update({
            where: { id: shipmentId },
            data: {
                status: ShipmentStatus.CANCELLED,
            },
        });
        await tx.shipmentStatusHistory.create({
            data: {
                shipmentId,
                status: ShipmentStatus.CANCELLED,
                note: `Shipment rejected by Operations Manager. Reason: ${payload.reason}`,
                updatedBy: managerUserId,
            },
        });
        return cancelledShipment;
    });
    return result;
};
// ==========================================
// Helper Services for Operations Routing
// ==========================================
const getCouriers = async (query) => {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;
    const whereConditions = {};
    if (query.hubId) {
        whereConditions.hubId = query.hubId;
    }
    if (query.availabilityStatus) {
        whereConditions.availabilityStatus = query.availabilityStatus;
    }
    if (query.searchTerm) {
        whereConditions.OR = [
            { vehicleNumber: { contains: query.searchTerm, mode: "insensitive" } },
            {
                user: {
                    OR: [
                        { name: { contains: query.searchTerm, mode: "insensitive" } },
                        { phone: { contains: query.searchTerm, mode: "insensitive" } },
                        { email: { contains: query.searchTerm, mode: "insensitive" } },
                    ],
                },
            },
        ];
    }
    const [couriers, total] = await Promise.all([
        prisma.courier.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
                hub: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        }),
        prisma.courier.count({
            where: whereConditions,
        }),
    ]);
    return {
        data: couriers,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getHubs = async () => {
    const hubs = await prisma.hub.findMany({
        where: { isActive: true },
        include: {
            zone: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    return hubs;
};
export const OperationsManagerService = {
    getAllShipments,
    getShipmentDetails,
    assignHubAndCourier,
    rejectShipment,
    getCouriers,
    getHubs,
};
