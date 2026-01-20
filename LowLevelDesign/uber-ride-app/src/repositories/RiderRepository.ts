import { Rider } from '../models/Rider';

/**
 * Repository for managing rider data
 */
export class RiderRepository {
    private riders: Map<string, Rider>;

    constructor() {
        this.riders = new Map(); // In-memory storage, in production would use database
    }

    save(rider: Rider): void {
        this.riders.set(rider.riderId, rider);
    }

    getById(riderId: string): Rider | undefined {
        return this.riders.get(riderId);
    }

    update(rider: Rider): void {
        if (this.riders.has(rider.riderId)) {
            this.riders.set(rider.riderId, rider);
        } else {
            throw new Error(`Rider with ID ${rider.riderId} not found`);
        }
    }

    getAll(): Rider[] {
        return Array.from(this.riders.values());
    }
}

