import { PaymentStrategy } from "./payment-strategy";

export class Cash implements PaymentStrategy {
    makePayment(amount: number): void {
        console.log(`Paid ${amount} with cash.`)
    }
}