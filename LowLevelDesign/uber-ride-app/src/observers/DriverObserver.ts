import { Observer, TripEventType } from '../patterns/Observer';
import { Driver } from '../models/Driver';
import { Trip } from '../models/Trip';
import { NotificationService } from '../services/NotificationService';

/**
 * Observer for Driver - handles notifications when trip status changes
 */
export class DriverObserver extends Observer {
    private driver: Driver;
    private notificationService: NotificationService;

    constructor(driver: Driver, notificationService: NotificationService) {
        super();
        this.driver = driver;
        this.notificationService = notificationService;
    }

    /**
     * Called when trip status changes
     */
    update(trip: Trip, eventType: TripEventType): void {
        if (!trip.driver || trip.driver.driverId !== this.driver.driverId) {
            return; // This notification is not for this driver
        }

        switch (eventType) {
            case 'STATUS_CHANGED':
                this.notificationService.notifyDriverOfTripStatusChange(this.driver, trip);
                break;
            case 'RIDE_REQUEST':
                this.notificationService.notifyDriverOfRideRequest(this.driver, trip);
                break;
            default:
                // Handle other event types if needed
                break;
        }
    }
}

