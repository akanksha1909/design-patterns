import { randomUUID as uuid } from 'node:crypto';
import { InvoiceItem } from './InvoiceItem';
import { InvoiceStatus } from '../enums/InvoiceStatus';

export class Invoice {
    public id: string;
    public items: InvoiceItem[];
    public createdAt: Date;
    public updatedAt: Date;
    public status: InvoiceStatus;
    public total: number;
    public warehouseId: string;
    public customerId: string;

    constructor(warehouseId: string, customerId: string, items: InvoiceItem[], total: number) {
        this.id = uuid();
        this.warehouseId = warehouseId;
        this.customerId = customerId;
        this.items = items;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = InvoiceStatus.DRAFT;
        this.total = total;
    }
}