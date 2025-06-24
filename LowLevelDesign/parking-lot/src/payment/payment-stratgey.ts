export interface PaymentStategy {
    makePayment(amount: number): void;
}