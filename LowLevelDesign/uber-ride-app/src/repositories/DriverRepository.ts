import { Driver } from '../models/Driver';

/**
 * Repository for managing driver data
 */
export class DriverRepository {
    private drivers: Map<string, Driver>;

    constructor() {
        this.drivers = new Map(); // In-memory storage, in production would use database
    }

    save(driver: Driver): void {
        this.drivers.set(driver.driverId, driver);
    }

    getById(driverId: string): Driver | undefined {
        return this.drivers.get(driverId);
    }

    update(driver: Driver): void {
        if (this.drivers.has(driver.driverId)) {
            this.drivers.set(driver.driverId, driver);
        } else {
            throw new Error(`Driver with ID ${driver.driverId} not found`);
        }
    }

    getAll(): Driver[] {
        return Array.from(this.drivers.values());
    }

    getAvailableDrivers(): Driver[] {
        return Array.from(this.drivers.values()).filter(driver => driver.isAvailable);
    }
}

