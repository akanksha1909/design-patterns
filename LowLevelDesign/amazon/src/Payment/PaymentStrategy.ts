export interface PaymentStrategy {
    makePayment(amount: number): boolean;
}