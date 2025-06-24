import { VehicleType } from "../vehicle/vehicle-type";
import { ParkingFloor } from "./parking-floor";
import { ParkingSpot } from "./parking-spot";

export class ParkingManager {
    constructor(private _floors: ParkingFloor[]) {}

    findSpot(vehicleType: VehicleType): ParkingSpot | null {
        for (const floor of this._floors) {
            const spot = floor.getParkingSpot(vehicleType);
            if (spot) return spot;
        }
        return null;
    }

    addFloor(floor: ParkingFloor) {
        this._floors.push(floor);
    }
}
