import { PricingStrategy } from "./PricingStrategy";

export class NoDiscountStrategy implements PricingStrategy {
    calculatePrice(invoiceItems: any[]): number {
        let totalPrice = 0;
        for (const item of invoiceItems) {
            totalPrice += item.quantity * item.unitPrice;
        }
        return totalPrice;
    }
}