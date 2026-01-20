import { TripStatus } from '../enums/TripStatus';
import { Rider } from '../models/Rider';
import { Driver } from '../models/Driver';
import { Trip } from '../models/Trip';

/**
 * Service responsible for sending notifications to riders and drivers
 */
export class NotificationService {
    /**
     * Notify driver about a new ride request
     */
    notifyDriverOfRideRequest(driver: Driver, trip: Trip): void {
        console.log(`📱 Notification to Driver ${driver.name}: New ride request from ${trip.pickupLocation.address} to ${trip.dropoffLocation.address}`);
        // In real implementation, this would send push notification, SMS, or email
    }

    /**
     * Notify rider that a driver has been assigned
     */
    notifyRiderOfDriverAssignment(rider: Rider, driver: Driver, trip: Trip): void {
        console.log(`📱 Notification to Rider ${rider.name}: Driver ${driver.name} has accepted your ride request. Vehicle: ${driver.vehicle.make} ${driver.vehicle.model} (${driver.vehicle.licensePlate})`);
    }

    /**
     * Notify rider about trip status changes
     */
    notifyRiderOfTripStatusChange(rider: Rider, trip: Trip): void {
        let message = '';
        switch (trip.status) {
            case TripStatus.DRIVER_ARRIVED:
                message = 'Your driver has arrived at the pickup location.';
                break;
            case TripStatus.IN_PROGRESS:
                message = 'Your trip has started. Enjoy your ride!';
                break;
            case TripStatus.COMPLETED:
                message = `Your trip has been completed. Fare: $${trip.fare.toFixed(2)}`;
                break;
            case TripStatus.CANCELLED:
                message = 'Your trip has been cancelled.';
                break;
            default:
                message = `Trip status updated to: ${trip.status}`;
        }
        console.log(`📱 Notification to Rider ${rider.name}: ${message}`);
    }

    /**
     * Notify driver about trip status changes
     */
    notifyDriverOfTripStatusChange(driver: Driver, trip: Trip): void {
        let message = '';
        switch (trip.status) {
            case TripStatus.IN_PROGRESS:
                message = `Trip started. Navigate to: ${trip.dropoffLocation.address}`;
                break;
            case TripStatus.COMPLETED:
                message = `Trip completed. Fare earned: $${trip.fare.toFixed(2)}`;
                break;
            case TripStatus.CANCELLED:
                message = 'Trip has been cancelled.';
                break;
            default:
                message = `Trip status updated to: ${trip.status}`;
        }
        console.log(`📱 Notification to Driver ${driver.name}: ${message}`);
    }
}

