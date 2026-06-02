import { NoDiscountStrategy } from "./strategy/NoDiscountStrategy";
import { WarehouseInvoiceManager } from "./WarehouseInvoiceManager";
import db from "./database/db";

class Demo {
    async run() {
        try {
            // Run migrations
            await db.migrate.latest();
            console.log("Migrations completed");

            const warehouseInvoiceManager = WarehouseInvoiceManager.getInstance()

            const invoiceItem1 = warehouseInvoiceManager.createInvoiceItem("item1", 10, 2);
            const invoiceItem2 = warehouseInvoiceManager.createInvoiceItem("item2", 20, 5);

            const pricingStrategy = new NoDiscountStrategy();
            const invoice = await warehouseInvoiceManager.createInvoice("customer1", "warehouse1", [invoiceItem1, invoiceItem2], pricingStrategy);
            
            console.log("Invoice created with ID:", invoice.id);
            console.log("Invoice total: ", invoice.total);

            // Retrieve the invoice
            const retrievedInvoice = await warehouseInvoiceManager.getInvoice(invoice.id);
            console.log("Retrieved invoice from DB:", retrievedInvoice);

            await db.destroy();
        } catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    }
}

new Demo().run();