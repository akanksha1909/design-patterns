import db from "../database/db";
import { Invoice } from "../entities/Invoice";

export class InvoiceRepository {
    async save(invoice: Invoice): Promise<void> {
        await db("invoices").insert({
            id: invoice.id,
            warehouse_id: invoice.warehouseId,
            customer_id: invoice.customerId,
            total: invoice.total,
            status: invoice.status,
            created_at: invoice.createdAt,
            updated_at: invoice.updatedAt,
        });

        if (invoice.items && invoice.items.length > 0) {
            const items = invoice.items.map((item) => ({
                id: item.id,
                invoice_id: invoice.id,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
            }));
            await db("invoice_items").insert(items);
        }
    }

    async findById(id: string): Promise<any> {
        const invoice = await db("invoices").where({ id }).first();
        if (!invoice) return null;

        const items = await db("invoice_items").where({ invoice_id: id });
        return { ...invoice, items };
    }

    async findAll(): Promise<any[]> {
        return db("invoices").select();
    }

    async update(id: string, invoice: Partial<Invoice>): Promise<void> {
        await db("invoices").where({ id }).update({
            status: invoice.status,
            updated_at: new Date(),
        });
    }

    async delete(id: string): Promise<void> {
        await db("invoices").where({ id }).delete();
    }
}