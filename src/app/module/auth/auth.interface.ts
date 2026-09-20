export interface IGoogleLoginPayload {
	idToken: string;
}

export interface IRegisterCustomerPayload {
	name: string;
	email: string;
	password: string;
}

export interface IVerifyEmailPayload {
	email: string;
	otp: string;
}