import { ParkingTicket } from "../parking-ticket";
import { VehicleType } from "../vehicle/vehicle-type";
import { FeeStrategy } from "./fee-strategy";

export class FlatFee implements FeeStrategy {
    private readonly _rates: Map<VehicleType, number>;

    constructor() {
        this._rates = new Map([
            [VehicleType.BIKE, 20],
            [VehicleType.CAR, 50],
        ]);
    }

    calculateFee(ticket: ParkingTicket): number {
        const vehicleType = ticket.vehicle.vehicleType;
        const rate = this._rates.get(vehicleType);
        if (rate === undefined) {
            throw new Error(`No flat fee defined for vehicle type: ${vehicleType}`);
        } 
        return rate;
    }
}