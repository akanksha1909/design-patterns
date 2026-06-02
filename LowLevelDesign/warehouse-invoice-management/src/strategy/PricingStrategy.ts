export interface PricingStrategy {
    calculatePrice(invoiceItems: any[]): number;
}