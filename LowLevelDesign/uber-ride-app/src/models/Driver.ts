import { Location } from './Location';
import { Vehicle } from './Vehicle';
import { Trip } from './Trip';

/**
 * Represents a driver who can accept and complete trips
 */
export class Driver {
    driverId: string;
    name: string;
    email: string;
    phoneNumber: string;
    vehicle: Vehicle;
    currentLocation: Location | null;
    isAvailable: boolean;
    tripHistory: Trip[];
    rating: number;
    totalTrips: number;

    constructor(driverId: string, name: string, email: string, phoneNumber: string, vehicle: Vehicle) {
        this.driverId = driverId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.vehicle = vehicle;
        this.currentLocation = null;
        this.isAvailable = true;
        this.tripHistory = [];
        this.rating = 0.0;
        this.totalTrips = 0;
    }

    setCurrentLocation(location: Location): void {
        this.currentLocation = location;
    }

    setAvailable(available: boolean): void {
        this.isAvailable = available;
    }

    addTripToHistory(trip: Trip): void {
        this.tripHistory.push(trip);
        this.totalTrips++;
    }

    updateRating(newRating: number): void {
        // Simple average calculation
        this.rating = ((this.rating * (this.totalTrips - 1)) + newRating) / this.totalTrips;
    }

    getTripHistory(): Trip[] {
        return this.tripHistory;
    }

    toString(): string {
        return `Driver{driverId='${this.driverId}', name='${this.name}', email='${this.email}', phoneNumber='${this.phoneNumber}', isAvailable=${this.isAvailable}, rating=${this.rating}}`;
    }
}

