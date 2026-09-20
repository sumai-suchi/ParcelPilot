import bcrypt from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import type { TokenPayload } from "google-auth-library";
import httpStatus from "http-status";
import type { SignOptions } from "jsonwebtoken";
import path from "path";
import {
	AuthProvider,
	UserRole,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import googleClient from "../../lib/googleOAuth";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwtutils";
import type {
	IGoogleLoginPayload,
	IRegisterCustomerPayload,
	IVerifyEmailPayload,
} from "./auth.interface";

const registerCustomer = async (payload: IRegisterCustomerPayload) => {
	const { name, password } = payload;

	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExists) {
		throw new AppError(
			httpStatus.CONFLICT,
			"User with this email already exists",
		);
	}

	const hashedPassword = await bcrypt.hash(password, 8);

	const expirationSeconds = 5 * 60;

	const otpKey = `customer-registration-otp:${email}`;
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",

			value: expirationSeconds,
		},
	});

	const customerRegistrationKey = `customer-registration-data:${email}`;
	const redisUserDataPayload = {
		name,
		email,
		password: hashedPassword,
	};

	await redisClient.set(
		customerRegistrationKey,
		JSON.stringify(redisUserDataPayload),
		{
			expiration: {
				type: "EX",
				value: expirationSeconds,
			},
		},
	);

	const tempatePath = path.join(
		process.cwd(),
		"src/app/templates/registration-user-otp.ejs",
	);

	const templateData = {
		name,
		email,
		otp: otpValue,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(tempatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Email Verification",

		html,
	});
};

const verifyCustomerEmail = async (payload: IVerifyEmailPayload) => {
	const otp = payload.otp;
	const email = payload.email.trim().toLowerCase();

	const isUserExist = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExist?.status === "SUSPENDED") {
		throw new AppError(httpStatus.FORBIDDEN, "User is SUSPENDED");
	}

	if (isUserExist?.emailVerified) {
		throw new AppError(httpStatus.CONFLICT, "Email ALready Verified");
	}

	if (isUserExist?.status && isUserExist?.status === "INACTIVE") {
		throw new AppError(httpStatus.FORBIDDEN, "User is INACTIVE");
	}

	const otpKey =`customer-registration-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
	}

	await redisClient.del(otpKey);

	const customerRegistrationKey = `customer-registration-data:${email}`;

	const redisCustomerData = await redisClient.get(customerRegistrationKey);

	if (!redisCustomerData) {
		throw new AppError(httpStatus.NOT_FOUND, "Customer Doesnt Exist");
	}

	const customerPayload: IRegisterCustomerPayload = JSON.parse(redisCustomerData);

	console.log("Customer Payload:", customerPayload);
	const createdUser = await prisma.user.create({
		data: {
			name: customerPayload.name,
			email: customerPayload.email,
			password: customerPayload.password,
			role: UserRole.CUSTOMER,
			status: UserStatus.ACTIVE,
			emailVerified: true,
			customer: {
				create: {
			
				},
			},
		},
		omit: { password: true },
		include: { customer: true },
	});

	await redisClient.del(customerRegistrationKey);

	const tempatePath = path.join(
		process.cwd(),
		"src/app/templates/customer-welcome-email.ejs",
	);

	const templateData = {
		name: createdUser.name,
	};

	const html = await ejs.renderFile(tempatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Welcome To PH Healthcare System",
		// text : `Your OTP is ${otp}`
		// html: `<h1>Your OTP is ${otp}</h1>`
		html,
	});

	const { customer, ...user } = createdUser;
	const jwtPayload = {
		userId: user.id.toString(),
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
		user,
		customer,
		accessToken,
		refreshToken,
	};
};

// const loginUser = async (payload: ILoginUserPayload) => {
// 	// throw new Error("Test Error");

// 	const { password } = payload;
// 	const email = payload.email.trim().toLowerCase();

// 	const user = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (!user) {
// 		// throw new Error("User not found");
// 		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
// 	}

// 	if (user.status === UserStatus.BLOCKED) {
// 		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
// 	}

// 	if (user.isDeleted || user.status === UserStatus.DELETED) {
// 		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
// 	}

// 	if (user.password === null && user.googleId !== null) {
// 		throw new AppError(
// 			httpStatus.BAD_REQUEST,
// 			"User Already Has Account Registered With Google. Try To Login With Google.",
// 		);
// 	}

// 	const isPasswordMatched = await bcrypt.compare(
// 		password,
// 		user.password as string,
// 	);

// 	if (!isPasswordMatched) {
// 		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
// 	}

// 	const jwtPayload = {
// 		userId: user.id.toString(),
// 		name: user.name,
// 		email: user.email,
// 		role: user.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	return {
// 		accessToken,
// 		refreshToken,
// 	};
// };
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
		userId: user.id.toString(),
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
	registerCustomer,
	verifyCustomerEmail
};
