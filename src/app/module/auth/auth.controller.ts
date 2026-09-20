import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IGoogleLoginPayload } from "./auth.interface";
import { AuthService } from "./auth.service";

const registerCustomerController = catchAsync(
	async (req: Request, res: Response) => {
		const payload = req.body;
		await AuthService.registerCustomer(payload);

		// res.cookie("accessToken", accessToken, {
		//     httpOnly: true,
		//     secure: false,
		//     sameSite: "none",
		//     maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
		// })
		// res.cookie("refreshToken", refreshToken, {
		//     httpOnly: true,
		//     secure: false,
		//     sameSite: "none",
		//     maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
		// })

		sendResponse(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			message: "OTP sent successfully",
			data: null,
		});
	},
);

const verifyCustomerEmailController = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.verifyCustomerEmail(payload);

	const { accessToken, refreshToken, user, customer } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Email Verified Successfully",
		data: {
			accessToken,
			refreshToken,
			user,
			customer,
		},
	});
});
// const loginUser = catchAsync(async (req: Request, res: Response) => {
// 	const payload = req.body;
// 	const result = await AuthService.loginUser(payload);
// 	const { accessToken, refreshToken } = result;

// 	res.cookie("accessToken", accessToken, {
// 		httpOnly: true,
// 		secure: false,
// 		sameSite: "none",
// 		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
// 	});
// 	res.cookie("refreshToken", refreshToken, {
// 		httpOnly: true,
// 		secure: false,
// 		sameSite: "none",
// 		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
// 	});

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "User logged in successfully",
// 		data: {
// 			accessToken,
// 			refreshToken,
// 		},
// 	});
// });

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.googleLogin(payload as IGoogleLoginPayload);

	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

export const AuthController = {
	googleLogin,
	registerCustomerController,
	verifyCustomerEmailController,
};
