import type { TokenPayload } from "google-auth-library";
import httpStatus from "http-status";
import type { SignOptions } from "jsonwebtoken";
import {
	AuthProvider,
	UserRole,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import googleClient from "../../lib/googleOAuth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwtutils";
import type { IGoogleLoginPayload } from "./auth.interface";


const googleLogin = async (payload: IGoogleLoginPayload) => {
	let googleIdTokenPayload: TokenPayload | null | undefined = null;

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Error verifying Google ID token:", error);
		throw new Error("Failed to verify Google ID token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Failed to verify Google ID token");
	}

	if (!googleIdTokenPayload) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid Or Expired Google Id Token",
		);
	}

	if (!googleIdTokenPayload.email) {
		throw new AppError(httpStatus.BAD_REQUEST, "Google Email Not Found");
	}
	if (!googleIdTokenPayload.name) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Google Email User Name Not Found",
		);
	}

	const ifCustomerExistWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			role: UserRole.CUSTOMER,
			googleId: googleIdTokenPayload.sub,
		},
	});

	let user = ifCustomerExistWithGoogleAuth;

	if (!ifCustomerExistWithGoogleAuth) {
		const ifCustomerExistWithCredentials = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				role: UserRole.CUSTOMER,
				authProvider: AuthProvider.CREDENTIALS,
			},
		});

		if (ifCustomerExistWithCredentials) {
			if (!ifCustomerExistWithCredentials.emailVerified) {
				throw new AppError(httpStatus.FORBIDDEN, "Email Not Verified");
			}

			if (ifCustomerExistWithCredentials.status === UserStatus.SUSPENDED) {
				throw new AppError(httpStatus.FORBIDDEN, "User Is Suspended");
			}

			if (ifCustomerExistWithCredentials.status === UserStatus.INACTIVE) {
				throw new AppError(httpStatus.FORBIDDEN, "User Is Deleted");
			}

			user = await prisma.user.update({
				where: {
					id: ifCustomerExistWithCredentials?.id,
				},

				data: {
					googleId: googleIdTokenPayload.sub,
				},
			});
		} else {
			// Google Register
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email: googleIdTokenPayload.email,
					role: UserRole.CUSTOMER,
					googleId: googleIdTokenPayload.sub,

					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,
					customer: {
						create: {},
					},
				},
			});
			// const tempatePath = path.join(
			// 	process.cwd(),
			// 	"src/app/templates/patient-welcome-email.ejs",
			// );

			// const templateData = {
			// 	name: user.name,
			// };

			// const html = await ejs.renderFile(tempatePath, templateData);

			// await transporter.sendMail({
			// 	from: config.email_sender,
			// 	to: user.email,
			// 	subject: "Welcome To PH Healthcare System",
			// 	// text : `Your OTP is ${otp}`
			// 	// html: `<h1>Your OTP is ${otp}</h1>`
			// 	html,
			// });
		}
	}

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	if (user.status === UserStatus.INACTIVE) {
		throw new AppError(httpStatus.FORBIDDEN, "User Is Inactive");
	}

	if (user.status === UserStatus.SUSPENDED) {
		throw new AppError(httpStatus.FORBIDDEN, "User Is Suspended");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

export const AuthService = {
	googleLogin,
};
