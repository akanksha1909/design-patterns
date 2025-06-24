export interface PaymentStrategy {
    makePayment(amount: number): void;
}