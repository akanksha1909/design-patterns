import { v4 as uuidv4 } from 'uuid';

export class Cart {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;
    public status: 'active' | 'checked_out' | 'abandoned';

    constructor(public userId: string) {
        this.id = uuidv4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = 'active';
    }

    setStatus(newStatus: 'active' | 'checked_out' | 'abandoned') {
        this.status = newStatus;
        this.updatedAt = new Date();
    }

    updateTimestamp() {
        this.updatedAt = new Date();
    }
}