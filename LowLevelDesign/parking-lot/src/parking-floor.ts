import { ParkingSpot } from "./parking-spot";
import { VehicleType } from "./vehicle/vehicle-type";

export class ParkingFloor {
    private readonly _floorNumber: number;
    private readonly _parkingSpots: ParkingSpot[]
    constructor(floorNumber: number, spots: ParkingSpot[]) {
        this._floorNumber = floorNumber;
        this._parkingSpots = spots;
    }

    getParkingSpot(vehicleType: VehicleType) {
        return this._parkingSpots.find(spot => spot.vehicleType == vehicleType && spot.isAvailable())
    }
}