import { Trip } from '../models/Trip';

/**
 * Repository for managing trip data
 */
export class TripRepository {
    private trips: Map<string, Trip>;

    constructor() {
        this.trips = new Map(); // In-memory storage, in production would use database
    }

    save(trip: Trip): void {
        this.trips.set(trip.tripId, trip);
    }

    getById(tripId: string): Trip | undefined {
        return this.trips.get(tripId);
    }

    update(trip: Trip): void {
        if (this.trips.has(trip.tripId)) {
            this.trips.set(trip.tripId, trip);
        } else {
            throw new Error(`Trip with ID ${trip.tripId} not found`);
        }
    }

    getAll(): Trip[] {
        return Array.from(this.trips.values());
    }

    getTripsByRider(riderId: string): Trip[] {
        return Array.from(this.trips.values()).filter(trip => trip.rider.riderId === riderId);
    }

    getTripsByDriver(driverId: string): Trip[] {
        return Array.from(this.trips.values()).filter(trip => 
            trip.driver && trip.driver.driverId === driverId
        );
    }
}

