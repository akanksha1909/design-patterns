import { Rider } from './models/Rider';
import { Driver } from './models/Driver';
import { Vehicle } from './models/Vehicle';
import { Location } from './models/Location';
import { RideTypeConfig } from './enums/RideType';
import { Trip } from './models/Trip';

import { RiderRepository } from './repositories/RiderRepository';
import { DriverRepository } from './repositories/DriverRepository';
import { TripRepository } from './repositories/TripRepository';

import { TripService } from './services/TripService';
import { NotificationService } from './services/NotificationService';
import { DriverMatchingService } from './services/DriverMatchingService';

/**
 * Main application class that orchestrates the Uber ride app
 */
export class UberRideApp {
    private riderRepository: RiderRepository;
    private driverRepository: DriverRepository;
    private tripRepository: TripRepository;
    private tripService: TripService;
    private notificationService: NotificationService;
    private driverMatchingService: DriverMatchingService;

    constructor() {
        // Initialize repositories
        this.riderRepository = new RiderRepository();
        this.driverRepository = new DriverRepository();
        this.tripRepository = new TripRepository();

        // Initialize services
        this.notificationService = new NotificationService();
        this.driverMatchingService = new DriverMatchingService(this.driverRepository);
        this.tripService = new TripService(
            this.tripRepository,
            this.driverRepository,
            this.riderRepository,
            this.notificationService,
            this.driverMatchingService
        );
    }

    /**
     * Register a new rider
     */
    registerRider(riderId: string, name: string, email: string, phoneNumber: string): Rider {
        const rider = new Rider(riderId, name, email, phoneNumber);
        this.riderRepository.save(rider);
        return rider;
    }

    /**
     * Register a new driver
     */
    registerDriver(driverId: string, name: string, email: string, phoneNumber: string, vehicle: Vehicle): Driver {
        const driver = new Driver(driverId, name, email, phoneNumber, vehicle);
        this.driverRepository.save(driver);
        return driver;
    }

    /**
     * Update rider's current location
     */
    updateRiderLocation(riderId: string, latitude: number, longitude: number, address: string): void {
        const rider = this.riderRepository.getById(riderId);
        if (!rider) {
            throw new Error(`Rider with ID ${riderId} not found`);
        }
        rider.setCurrentLocation(new Location(latitude, longitude, address));
        this.riderRepository.update(rider);
    }

    /**
     * Update driver's current location
     */
    updateDriverLocation(driverId: string, latitude: number, longitude: number, address: string): void {
        const driver = this.driverRepository.getById(driverId);
        if (!driver) {
            throw new Error(`Driver with ID ${driverId} not found`);
        }
        driver.setCurrentLocation(new Location(latitude, longitude, address));
        this.driverRepository.update(driver);
    }

    /**
     * Request a ride
     */
    requestRide(
        riderId: string,
        pickupLat: number,
        pickupLon: number,
        pickupAddress: string,
        dropoffLat: number,
        dropoffLon: number,
        dropoffAddress: string,
        rideType: RideTypeConfig
    ): Trip {
        const pickupLocation = new Location(pickupLat, pickupLon, pickupAddress);
        const dropoffLocation = new Location(dropoffLat, dropoffLon, dropoffAddress);
        return this.tripService.requestRide(riderId, pickupLocation, dropoffLocation, rideType);
    }

    /**
     * Driver accepts a ride
     */
    acceptRide(driverId: string, tripId: string): Trip {
        return this.tripService.acceptRide(driverId, tripId);
    }

    /**
     * Driver rejects a ride
     */
    rejectRide(driverId: string, tripId: string): Trip {
        return this.tripService.rejectRide(driverId, tripId);
    }

    /**
     * Driver arrives at pickup
     */
    driverArrived(driverId: string, tripId: string): Trip {
        return this.tripService.driverArrived(driverId, tripId);
    }

    /**
     * Driver starts the trip
     */
    startTrip(driverId: string, tripId: string): Trip {
        return this.tripService.startTrip(driverId, tripId);
    }

    /**
     * Driver ends the trip
     */
    endTrip(driverId: string, tripId: string): Trip {
        return this.tripService.endTrip(driverId, tripId);
    }

    /**
     * Cancel a trip
     */
    cancelTrip(tripId: string, cancelledBy?: string): Trip {
        return this.tripService.cancelTrip(tripId, cancelledBy);
    }

    /**
     * Get trip status
     */
    getTripStatus(tripId: string): Trip {
        return this.tripService.getTripStatus(tripId);
    }

    /**
     * Get rider's trip history
     */
    getRiderTripHistory(riderId: string): Trip[] {
        const rider = this.riderRepository.getById(riderId);
        if (!rider) {
            throw new Error(`Rider with ID ${riderId} not found`);
        }
        return rider.getTripHistory();
    }

    /**
     * Get driver's trip history
     */
    getDriverTripHistory(driverId: string): Trip[] {
        const driver = this.driverRepository.getById(driverId);
        if (!driver) {
            throw new Error(`Driver with ID ${driverId} not found`);
        }
        return driver.getTripHistory();
    }
}

