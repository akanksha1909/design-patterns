import { Ticket } from "../entities/Ticket";
import { VehicleType } from "../enums/VehicleType";
import { FeeStrategy } from "./FeeStrategy";

export class HourlyFeeStrategy implements FeeStrategy {
    private _hourlyRates: { [x: number]: number; };

    constructor() {
        this._hourlyRates = {
            [VehicleType.MOTORCYCLE]: 10,
            [VehicleType.CAR]: 30,
            [VehicleType.VAN]: 50
        }
    }

    calculateFee(ticket: Ticket, exitTime: number): number {
        const parkingSpot = ticket.getParkingSpot();
        const vehicleType = parkingSpot.getSpotType();
        const rate = this._hourlyRates[vehicleType];
        const durationInMs = exitTime - ticket.getEntryTime();
        const durationInHours = Math.ceil(durationInMs / (1000 * 60 * 60));
        return rate * durationInHours;
    }
}