/**
 * Enum representing the various states of a trip
 */
export enum TripStatus {
    REQUESTED = 'REQUESTED',           // Rider has requested a ride
    DRIVER_ASSIGNED = 'DRIVER_ASSIGNED', // Driver has accepted the request
    DRIVER_ARRIVED = 'DRIVER_ARRIVED',  // Driver has arrived at pickup location
    IN_PROGRESS = 'IN_PROGRESS',        // Trip is ongoing
    COMPLETED = 'COMPLETED',            // Trip has been completed
    CANCELLED = 'CANCELLED'             // Trip was cancelled
}

