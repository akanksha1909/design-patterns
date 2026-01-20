import { Location } from './Location';
import { Trip } from './Trip';

/**
 * Represents a rider/user who can request rides
 */
export class Rider {
    riderId: string;
    name: string;
    email: string;
    phoneNumber: string;
    currentLocation: Location | null;
    tripHistory: Trip[];

    constructor(riderId: string, name: string, email: string, phoneNumber: string) {
        this.riderId = riderId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.currentLocation = null;
        this.tripHistory = [];
    }

    setCurrentLocation(location: Location): void {
        this.currentLocation = location;
    }

    addTripToHistory(trip: Trip): void {
        this.tripHistory.push(trip);
    }

    getTripHistory(): Trip[] {
        return this.tripHistory;
    }

    toString(): string {
        return `Rider{riderId='${this.riderId}', name='${this.name}', email='${this.email}', phoneNumber='${this.phoneNumber}'}`;
    }
}

