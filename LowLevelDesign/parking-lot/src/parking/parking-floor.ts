import { ParkingSpot } from "./parking-spot";
import { VehicleType } from "../vehicle/vehicle-type";

export class ParkingFloor {
    private readonly _floorNumber: number;
    private readonly _parkingSpots: ParkingSpot[]
    constructor(floorNumber: number, spots: ParkingSpot[]) {
        if (floorNumber < 0) {
            throw new Error('Floor number must be non-negative');
        }
        if (!spots || spots.length === 0) {
            throw new Error('Floor must have at least one parking spot');
        }
        this._floorNumber = floorNumber;
        this._parkingSpots = spots;
    }

    get floorNumber(): number {
        return this._floorNumber;
    }

    getParkingSpot(vehicleType: VehicleType) {
        return this._parkingSpots.find(spot => spot.vehicleType === vehicleType && spot.isAvailable()) || null;
    }
}