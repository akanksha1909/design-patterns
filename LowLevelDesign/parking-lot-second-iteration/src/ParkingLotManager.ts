import { ParkingSpot } from "./entities/ParkingSpot";
import { Ticket } from "./entities/Ticket";
import { VehicleType } from "./enums/VehicleType";
import { HourlyFeeStrategy } from "./fee/HourlyFeeStrategy";
import { Mutex } from "./utils/Mutex";

export class ParkingLotManager {
    private static _instance: ParkingLotManager;
    private _parkingSpots: Map<String, ParkingSpot>;
    private _activeTickets: Map<String, Ticket>;
    private _occupiedSpotIds: Set<String>;
    // Per-spot locks for fine-grained concurrency control
    private _spotLocks: Map<String, Mutex>;
    
    private constructor() {
        this._activeTickets = new Map();
        this._parkingSpots = new Map();
        this._occupiedSpotIds = new Set();
        this._spotLocks = new Map();
    }

    public static getInstance(): ParkingLotManager {
        if (this._instance == null) {
            this._instance = new ParkingLotManager();
        }
        return this._instance;
    }

    /**
     * Park a vehicle with per-spot locking for thread safety.
     * Uses fine-grained locking - each spot has its own lock,
     * allowing multiple vehicles to park in different spots concurrently.
     */
    async parkVehicle(vehicleType: VehicleType): Promise<Ticket> {
        // Try to find and lock an available spot
        const availableSpot = await this._findAvailableSpotWithLock(vehicleType);
        
        if (!availableSpot) {
            throw new Error(`No available parking spot for vehicle type: ${vehicleType}`);
        }

        const ticket = new Ticket(availableSpot, Date.now());
        this._activeTickets.set(ticket.getId(), ticket);
        return ticket;
    }

    /**
     * Unpark a vehicle with per-spot locking for thread safety.
     */
    async unParkVehicle(ticketId: String): Promise<number> {
        const ticket = this._activeTickets.get(ticketId);
        if (!ticket) {
            throw new Error(`Ticket not found: ${ticketId}`);
        }

        const spotId = ticket.getParkingSpot().getId();
        const lock = this._getLockForSpot(spotId);

        // Acquire lock for the specific spot
        await lock.acquire();
        try {
            // Double-check ticket still exists (could have been deleted by another thread)
            if (!this._activeTickets.has(ticketId)) {
                return 0;
            }

            // Calculate fee
            const fee = new HourlyFeeStrategy().calculateFee(ticket, Date.now());
            
            // Free up slot atomically
            this._occupiedSpotIds.delete(spotId);
            this._activeTickets.delete(ticketId);
            
            return fee;
        } finally {
            lock.release();
        }
    }

    /**
     * Find an available spot using per-spot locking.
     * Uses try-lock pattern: attempts to acquire lock on each spot as we check it.
     */
    private async _findAvailableSpotWithLock(vehicleType: VehicleType): Promise<ParkingSpot | null> {
        // Get all spots matching the vehicle type
        const matchingSpots = this._getSpotsByType(vehicleType);

        // Try each spot with its lock
        for (const spot of matchingSpots) {
            const spotId = spot.getId();
            const lock = this._getLockForSpot(spotId);

            // Try to acquire lock without blocking
            if (lock.tryAcquire()) {
                try {
                    // Double-check spot is still available (another thread might have just taken it)
                    if (!this._occupiedSpotIds.has(spotId)) {
                        // Successfully reserved this spot
                        this._occupiedSpotIds.add(spotId);
                        return spot;
                    }
                } finally {
                    // Always release lock if we acquired it
                    lock.release();
                }
            }
            // If lock not available, continue to next spot
        }

        // If no spot available immediately, try waiting for locks
        // This handles the case where all spots are being checked simultaneously
        for (const spot of matchingSpots) {
            const spotId = spot.getId();
            const lock = this._getLockForSpot(spotId);

            // Wait for lock (but don't wait too long)
            await lock.acquire();
            try {
                if (!this._occupiedSpotIds.has(spotId)) {
                    this._occupiedSpotIds.add(spotId);
                    return spot;
                }
            } finally {
                lock.release();
            }
        }

        return null;
    }

    /**
     * Get or create a mutex lock for a specific parking spot.
     */
    private _getLockForSpot(spotId: String): Mutex {
        if (!this._spotLocks.has(spotId)) {
            this._spotLocks.set(spotId, new Mutex());
        }
        return this._spotLocks.get(spotId)!;
    }

    /**
     * Get all parking spots matching the given vehicle type.
     */
    private _getSpotsByType(vehicleType: VehicleType): ParkingSpot[] {
        const spots: ParkingSpot[] = [];
        for (const [key, spot] of this._parkingSpots.entries()) {
            if (spot.getSpotType().valueOf() === vehicleType) {
                spots.push(spot);
            }
        }
        return spots;
    }

    /**
     * Legacy synchronous method - kept for backward compatibility.
     * @deprecated Use async parkVehicle() instead for thread safety
     */
    private _findAvailableSpot(vehicleType: VehicleType): ParkingSpot | null {
        let availableSlot = null;
        for (let [key, value] of this._parkingSpots.entries()) {
            if (value.getSpotType().valueOf() === vehicleType && !this._occupiedSpotIds.has(key)) {
                availableSlot = value;
                break;
            }
        }

        if (availableSlot) {
            this._occupiedSpotIds.add(availableSlot.getId());
        }

        return availableSlot;
    }
}