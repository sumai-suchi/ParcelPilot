import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OperationsManagerService } from "./operationsManager.service";
const getAllShipments = catchAsync(async (req, res) => {
    const result = await OperationsManagerService.getAllShipments(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shipments retrieved successfully for operational review.",
        data: result.data,
        meta: result.meta,
    });
});
const getShipmentDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OperationsManagerService.getShipmentDetails(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shipment operational details retrieved successfully.",
        data: result,
    });
});
const assignHubAndCourier = catchAsync(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User context missing from request.");
    }
    const { id } = req.params;
    const result = await OperationsManagerService.assignHubAndCourier(user.userId, id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Origin Hub, Destination Hub, and Courier assigned successfully.",
        data: result,
    });
});
const rejectShipment = catchAsync(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User context missing from request.");
    }
    const { id } = req.params;
    const result = await OperationsManagerService.rejectShipment(user.userId, id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shipment rejected successfully.",
        data: result,
    });
});
const getCouriers = catchAsync(async (req, res) => {
    const result = await OperationsManagerService.getCouriers(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Couriers retrieved successfully.",
        data: result.data,
        meta: result.meta,
    });
});
const getHubs = catchAsync(async (_req, res) => {
    const result = await OperationsManagerService.getHubs();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Distribution hubs retrieved successfully.",
        data: result,
    });
});
export const OperationsManagerController = {
    getAllShipments,
    getShipmentDetails,
    assignHubAndCourier,
    rejectShipment,
    getCouriers,
    getHubs,
};
