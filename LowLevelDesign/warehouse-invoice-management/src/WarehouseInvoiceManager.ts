import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";
import { InvoiceRepository } from "./repositories/InvoiceRepository";
import { InvoiceService } from "./services/InvoiceService";
import { PricingStrategy } from "./strategy/PricingStrategy";

export class WarehouseInvoiceManager {
    private static _instance: WarehouseInvoiceManager;
    private invoiceService: InvoiceService;

    private constructor() {
        this.invoiceService = InvoiceService.getInstance(new InvoiceRepository());
    }

    public static getInstance(): WarehouseInvoiceManager {
        if (!WarehouseInvoiceManager._instance) {
            WarehouseInvoiceManager._instance = new WarehouseInvoiceManager()
        }
        return WarehouseInvoiceManager._instance;
    }

    public createInvoiceItem(productId: string, quantity: number, price: number): InvoiceItem {
        const invoiceItem = new InvoiceItem(productId, quantity, price);
        return invoiceItem;
    }

    public async createInvoice(customerId: string, warehouseId: string, items: InvoiceItem[], pricingStrategy: PricingStrategy): Promise<Invoice> {
        const invoice = await this.invoiceService.createDraft(customerId, warehouseId, items, pricingStrategy);
        return invoice;
    }

    public async getInvoice(id: string): Promise<any> {
        return await this.invoiceService.findInvoice(id);
    }
}