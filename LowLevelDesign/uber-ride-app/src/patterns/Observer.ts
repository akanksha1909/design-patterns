import { Trip } from '../models/Trip';

/**
 * Event types for trip notifications
 */
export type TripEventType = 'DRIVER_ASSIGNED' | 'STATUS_CHANGED' | 'RIDE_REQUEST';

/**
 * Observer interface - defines the update method that observers must implement
 */
export abstract class Observer {
    /**
     * Called when the subject (Trip) notifies observers of a change
     * @param trip - The trip that has changed
     * @param eventType - Type of event (STATUS_CHANGED, DRIVER_ASSIGNED, etc.)
     */
    abstract update(trip: Trip, eventType: TripEventType): void;
}

