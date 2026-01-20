import { Trip } from '../models/Trip';
import { TripStatus } from '../enums/TripStatus';
import { RideTypeConfig } from '../enums/RideType';
import { Location } from '../models/Location';
import { RiderObserver } from '../observers/RiderObserver';
import { DriverObserver } from '../observers/DriverObserver';
import { TripRepository } from '../repositories/TripRepository';
import { DriverRepository } from '../repositories/DriverRepository';
import { RiderRepository } from '../repositories/RiderRepository';
import { NotificationService } from './NotificationService';
import { DriverMatchingService } from './DriverMatchingService';

/**
 * Service responsible for managing trip lifecycle
 * Uses Observer pattern for notifications
 */
export class TripService {
    private tripRepository: TripRepository;
    private driverRepository: DriverRepository;
    private riderRepository: RiderRepository;
    private notificationService: NotificationService;
    private driverMatchingService: DriverMatchingService;
    
    // Map to store observers for each rider and driver
    private riderObservers: Map<string, RiderObserver>;
    private driverObservers: Map<string, DriverObserver>;

    constructor(
        tripRepository: TripRepository,
        driverRepository: DriverRepository,
        riderRepository: RiderRepository,
        notificationService: NotificationService,
        driverMatchingService: DriverMatchingService
    ) {
        this.tripRepository = tripRepository;
        this.driverRepository = driverRepository;
        this.riderRepository = riderRepository;
        this.notificationService = notificationService;
        this.driverMatchingService = driverMatchingService;
        this.riderObservers = new Map();
        this.driverObservers = new Map();
    }

    /**
     * Get or create rider observer
     */
    private getRiderObserver(riderId: string): RiderObserver | undefined {
        if (!this.riderObservers.has(riderId)) {
            const rider = this.riderRepository.getById(riderId);
            if (rider) {
                const observer = new RiderObserver(rider, this.notificationService);
                this.riderObservers.set(riderId, observer);
            }
        }
        return this.riderObservers.get(riderId);
    }

    /**
     * Get or create driver observer
     */
    private getDriverObserver(driverId: string): DriverObserver | undefined {
        if (!this.driverObservers.has(driverId)) {
            const driver = this.driverRepository.getById(driverId);
            if (driver) {
                const observer = new DriverObserver(driver, this.notificationService);
                this.driverObservers.set(driverId, observer);
            }
        }
        return this.driverObservers.get(driverId);
    }

    /**
     * Request a ride from a rider
     */
    requestRide(riderId: string, pickupLocation: Location, dropoffLocation: Location, rideType: RideTypeConfig): Trip {
        const rider = this.riderRepository.getById(riderId);
        if (!rider) {
            throw new Error(`Rider with ID ${riderId} not found`);
        }

        // Create new trip
        const trip = new Trip(rider, pickupLocation, dropoffLocation, rideType);
        
        // Attach rider observer to trip
        const riderObserver = this.getRiderObserver(riderId);
        if (riderObserver) {
            trip.attach(riderObserver);
        }
        
        this.tripRepository.save(trip);

        // Notify nearby drivers using observer pattern
        const notifiedDrivers = this.driverMatchingService.notifyNearbyDrivers(trip, this.driverObservers);
        
        if (notifiedDrivers.length === 0) {
            console.log(`⚠️  No available drivers found for ride type: ${rideType.displayName}`);
        }

        return trip;
    }

    /**
     * Driver accepts a ride request
     */
    acceptRide(driverId: string, tripId: string): Trip {
        const driver = this.driverRepository.getById(driverId);
        const trip = this.tripRepository.getById(tripId);

        if (!driver) {
            throw new Error(`Driver with ID ${driverId} not found`);
        }

        if (!trip) {
            throw new Error(`Trip with ID ${tripId} not found`);
        }

        if (!driver.isAvailable) {
            throw new Error(`Driver ${driverId} is not available`);
        }

        if (trip.status !== TripStatus.REQUESTED) {
            throw new Error(`Trip ${tripId} is not in REQUESTED status`);
        }

        // Attach driver observer to trip
        const driverObserver = this.getDriverObserver(driverId);
        if (driverObserver) {
            trip.attach(driverObserver);
        }

        // Assign driver to trip (this will trigger observer notification)
        trip.setDriver(driver);
        trip.setStatus(TripStatus.DRIVER_ASSIGNED);
        driver.setAvailable(false);

        // Update repositories
        this.tripRepository.update(trip);
        this.driverRepository.update(driver);

        return trip;
    }

    /**
     * Driver rejects a ride request
     */
    rejectRide(driverId: string, tripId: string): Trip {
        const driver = this.driverRepository.getById(driverId);
        const trip = this.tripRepository.getById(tripId);

        if (!driver || !trip) {
            throw new Error('Driver or trip not found');
        }

        // Try to find another driver
        const bestDriver = this.driverMatchingService.findBestDriver(trip);
        if (bestDriver) {
            const driverObserver = this.getDriverObserver(bestDriver.driverId);
            if (driverObserver) {
                trip.attach(driverObserver);
                driverObserver.update(trip, 'RIDE_REQUEST');
            }
        } else {
            console.log(`⚠️  No alternative driver found for trip ${tripId}`);
        }

        return trip;
    }

    /**
     * Driver arrives at pickup location
     */
    driverArrived(driverId: string, tripId: string): Trip {
        const driver = this.driverRepository.getById(driverId);
        const trip = this.tripRepository.getById(tripId);

        if (!driver || !trip) {
            throw new Error('Driver or trip not found');
        }

        if (!trip.driver || trip.driver.driverId !== driverId) {
            throw new Error('Driver is not assigned to this trip');
        }

        // Status change will automatically notify observers
        trip.setStatus(TripStatus.DRIVER_ARRIVED);
        this.tripRepository.update(trip);

        return trip;
    }

    /**
     * Driver starts the trip
     */
    startTrip(driverId: string, tripId: string): Trip {
        const driver = this.driverRepository.getById(driverId);
        const trip = this.tripRepository.getById(tripId);

        if (!driver || !trip) {
            throw new Error('Driver or trip not found');
        }

        if (!trip.driver || trip.driver.driverId !== driverId) {
            throw new Error('Driver is not assigned to this trip');
        }

        if (trip.status !== TripStatus.DRIVER_ARRIVED && trip.status !== TripStatus.DRIVER_ASSIGNED) {
            throw new Error(`Trip cannot be started from status: ${trip.status}`);
        }

        // Status change will automatically notify observers
        trip.startTrip();
        this.tripRepository.update(trip);

        return trip;
    }

    /**
     * Driver ends/completes the trip
     */
    endTrip(driverId: string, tripId: string): Trip {
        const driver = this.driverRepository.getById(driverId);
        const trip = this.tripRepository.getById(tripId);

        if (!driver || !trip) {
            throw new Error('Driver or trip not found');
        }

        if (!trip.driver || trip.driver.driverId !== driverId) {
            throw new Error('Driver is not assigned to this trip');
        }

        if (trip.status !== TripStatus.IN_PROGRESS) {
            throw new Error(`Trip cannot be ended from status: ${trip.status}`);
        }

        // Status change will automatically notify observers
        trip.completeTrip();
        driver.setAvailable(true);
        driver.addTripToHistory(trip);
        trip.rider.addTripToHistory(trip);

        this.tripRepository.update(trip);
        this.driverRepository.update(driver);
        this.riderRepository.update(trip.rider);

        return trip;
    }

    /**
     * Cancel a trip
     */
    cancelTrip(tripId: string, cancelledBy?: string): Trip {
        const trip = this.tripRepository.getById(tripId);
        if (!trip) {
            throw new Error(`Trip with ID ${tripId} not found`);
        }

        if (trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELLED) {
            throw new Error(`Trip cannot be cancelled from status: ${trip.status}`);
        }

        // Status change will automatically notify observers
        trip.cancelTrip();

        if (trip.driver) {
            trip.driver.setAvailable(true);
            this.driverRepository.update(trip.driver);
        }

        this.tripRepository.update(trip);

        return trip;
    }

    /**
     * Get trip status
     */
    getTripStatus(tripId: string): Trip {
        const trip = this.tripRepository.getById(tripId);
        if (!trip) {
            throw new Error(`Trip with ID ${tripId} not found`);
        }
        return trip;
    }
}

