import { Invoice } from "../entities/Invoice"
import { InvoiceRepository } from "../repositories/InvoiceRepository";

export class InvoiceService {

    private static _instance: InvoiceService;
    public invoiceRepository: InvoiceRepository;

    private constructor(invoiceRepository: InvoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public static getInstance(invoiceRepository: InvoiceRepository): InvoiceService {
        if (!InvoiceService._instance) {
            InvoiceService._instance = new InvoiceService(invoiceRepository);
        }
        return InvoiceService._instance;
    }

    async createDraft(customerId: string, warehouseId: string, items: any[], pricingStrategy: any): Promise<Invoice> {
        const total = pricingStrategy.calculatePrice(items);
        const invoice = new Invoice(warehouseId, customerId, items, total)
        await this.invoiceRepository.save(invoice)
        return invoice;
    }

    async findInvoice(id: string): Promise<any> {
        return await this.invoiceRepository.findById(id);
    }
}