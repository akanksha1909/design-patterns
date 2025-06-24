import { Vehicle } from "../vehicle/vehicle";
import { VehicleType } from "../vehicle/vehicle-type";

export class ParkingSpot {
    private _vehicle: Vehicle | null = null;
    private readonly _spotNumber: number;
    private readonly _vehicleType: VehicleType;

    constructor(spotNumber: number, vehicleType: VehicleType) {

        if (spotNumber <= 0) {
            throw new Error('Spot number must be positive');
        }
        this._spotNumber = spotNumber;
        this._vehicleType = vehicleType;
    }

    get vehicleType(): VehicleType {
        return this._vehicleType;
    }

    park(vehicle: Vehicle) {
        if (this._vehicle) {
            throw new Error('Parking Spot is not available!');
        }

        if (vehicle.vehicleType != this._vehicleType) {
            throw new Error('Incompatible vehicle type!');
        }

        this._vehicle = vehicle;
    }

    unpark() {
        if (!this._vehicle) {
            throw new Error('No vehicle to unpark!');
        }
        this._vehicle = null;
    }

    isAvailable(): boolean {
        return this._vehicle === null;
    }
}