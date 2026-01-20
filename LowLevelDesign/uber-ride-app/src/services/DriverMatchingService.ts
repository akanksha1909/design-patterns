import { Trip } from '../models/Trip';
import { Driver } from '../models/Driver';
import { DriverRepository } from '../repositories/DriverRepository';
import { DriverObserver } from '../observers/DriverObserver';

/**
 * Service responsible for matching riders with available drivers
 */
export class DriverMatchingService {
    private driverRepository: DriverRepository;

    constructor(driverRepository: DriverRepository) {
        this.driverRepository = driverRepository;
    }

    /**
     * Find the best available driver for a trip request
     * Criteria: Available, supports ride type, closest to pickup location
     */
    findBestDriver(trip: Trip): Driver | null {
        const availableDrivers = this.driverRepository.getAvailableDrivers();
        
        // Filter drivers who support the requested ride type
        const compatibleDrivers = availableDrivers.filter(driver => 
            driver.vehicle.supportedRideType === trip.rideType
        );

        if (compatibleDrivers.length === 0) {
            return null;
        }

        // Find the closest driver to pickup location
        let bestDriver: Driver | null = null;
        let minDistance = Infinity;

        for (const driver of compatibleDrivers) {
            if (driver.currentLocation) {
                const distance = trip.pickupLocation.calculateDistance(driver.currentLocation);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDriver = driver;
                }
            }
        }

        return bestDriver;
    }

    /**
     * Notify nearby drivers about a ride request using Observer pattern
     */
    notifyNearbyDrivers(trip: Trip, driverObservers: Map<string, DriverObserver>, maxDistance: number = 5.0): Driver[] {
        const availableDrivers = this.driverRepository.getAvailableDrivers();
        const compatibleDrivers = availableDrivers.filter(driver => 
            driver.vehicle.supportedRideType === trip.rideType &&
            driver.currentLocation &&
            trip.pickupLocation.calculateDistance(driver.currentLocation) <= maxDistance
        );

        // Attach driver observers to trip and notify them
        compatibleDrivers.forEach(driver => {
            const observer = driverObservers.get(driver.driverId);
            if (observer) {
                trip.attach(observer);
                // Manually trigger notification for ride request
                observer.update(trip, 'RIDE_REQUEST');
            }
        });

        return compatibleDrivers;
    }
}

