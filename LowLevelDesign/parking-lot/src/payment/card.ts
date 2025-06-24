import { PaymentStrategy } from "./payment-strategy";

export class Card implements PaymentStrategy {
    makePayment(amount: number): void {
        console.log(`Paid ${amount} with card.`)
    }
}