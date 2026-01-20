import { v4 as uuidv4 } from 'uuid';
import { TripStatus } from '../enums/TripStatus';
import { RideTypeConfig } from '../enums/RideType';
import { Subject } from '../patterns/Subject';
import { TripEventType } from '../patterns/Observer';
import { Rider } from './Rider';
import { Driver } from './Driver';
import { Location } from './Location';

/**
 * Represents a trip/ride from pickup to drop-off location
 * Implements Subject pattern to notify observers of status changes
 */
export class Trip extends Subject {
    tripId: string;
    rider: Rider;
    driver: Driver | null;
    pickupLocation: Location;
    dropoffLocation: Location;
    rideType: RideTypeConfig;
    status: TripStatus;
    requestedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    fare: number;
    distance: number;

    constructor(rider: Rider, pickupLocation: Location, dropoffLocation: Location, rideType: RideTypeConfig) {
        super();
        this.tripId = uuidv4();
        this.rider = rider;
        this.driver = null;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.rideType = rideType;
        this.status = TripStatus.REQUESTED;
        this.requestedAt = new Date();
        this.startedAt = null;
        this.completedAt = null;
        this.fare = 0.0;
        this.distance = pickupLocation.calculateDistance(dropoffLocation);
    }

    setDriver(driver: Driver): void {
        this.driver = driver;
        // Notify observers that driver has been assigned
        this.notify(this, 'DRIVER_ASSIGNED');
    }

    setStatus(status: TripStatus): void {
        const oldStatus = this.status;
        this.status = status;
        // Notify observers of status change
        if (oldStatus !== status) {
            this.notify(this, 'STATUS_CHANGED');
        }
    }

    /**
     * Calculate fare based on distance and ride type
     */
    calculateFare(): void {
        const baseFare = 50.0; // Base fare in currency units
        const perKmRate = 10.0; // Rate per kilometer
        this.fare = (baseFare + (this.distance * perKmRate)) * this.rideType.priceMultiplier;
    }

    startTrip(): void {
        this.setStatus(TripStatus.IN_PROGRESS);
        this.startedAt = new Date();
    }

    completeTrip(): void {
        this.setStatus(TripStatus.COMPLETED);
        this.completedAt = new Date();
        this.calculateFare();
    }

    cancelTrip(): void {
        this.setStatus(TripStatus.CANCELLED);
    }

    toString(): string {
        return `Trip{tripId='${this.tripId}', rider=${this.rider ? this.rider.name : 'null'}, driver=${this.driver ? this.driver.name : 'null'}, status=${this.status}, fare=${this.fare}, distance=${this.distance}}`;
    }
}

