import { ParkingTicket } from "../parking-ticket";
import { VehicleType } from "../vehicle/vehicle-type";
import { FeeStrategy } from "./fee-strategy";

export class HourlyFee implements FeeStrategy {
    private readonly _hourlyRates: Map<VehicleType, number>;

    constructor() {
        this._hourlyRates = new Map([
            [VehicleType.BIKE, 10],
            [VehicleType.CAR, 30],
        ]);
    }

    calculateFee(ticket: ParkingTicket): number {
        const vehicleType = ticket.vehicle.vehicleType;
        const rate = this._hourlyRates.get(vehicleType);
        if (rate === undefined) {
            throw new Error(`No flat fee defined for vehicle type: ${vehicleType}`);
        }
        const durationInMs = ticket.getDuration();
        const durationInHours = Math.ceil(durationInMs / 1000 * 60 * 60);
        return rate * durationInHours;
    }
}