export interface ICreatePaymentIntentPayload {
	currency?: string;
}

export interface IConfirmPaymentPayload {
	paymentIntentId: string;
	paymentMethodId?: string;
}
