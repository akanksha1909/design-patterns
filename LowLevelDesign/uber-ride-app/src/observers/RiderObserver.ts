import { Observer, TripEventType } from '../patterns/Observer';
import { Rider } from '../models/Rider';
import { Trip } from '../models/Trip';
import { NotificationService } from '../services/NotificationService';

/**
 * Observer for Rider - handles notifications when trip status changes
 */
export class RiderObserver extends Observer {
    private rider: Rider;
    private notificationService: NotificationService;

    constructor(rider: Rider, notificationService: NotificationService) {
        super();
        this.rider = rider;
        this.notificationService = notificationService;
    }

    /**
     * Called when trip status changes
     */
    update(trip: Trip, eventType: TripEventType): void {
        if (trip.rider.riderId !== this.rider.riderId) {
            return; // This notification is not for this rider
        }

        switch (eventType) {
            case 'DRIVER_ASSIGNED':
                if (trip.driver) {
                    this.notificationService.notifyRiderOfDriverAssignment(this.rider, trip.driver, trip);
                }
                break;
            case 'STATUS_CHANGED':
                this.notificationService.notifyRiderOfTripStatusChange(this.rider, trip);
                break;
            default:
                // Handle other event types if needed
                break;
        }
    }
}

