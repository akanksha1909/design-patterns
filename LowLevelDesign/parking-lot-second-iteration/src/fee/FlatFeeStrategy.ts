import { Ticket } from "../entities/Ticket";
import { VehicleType } from "../enums/VehicleType";
import { FeeStrategy } from "./FeeStrategy";

export class FlatFeeStrategy implements FeeStrategy {
    private _rates: Record<VehicleType, number>
    constructor() {
        this._rates = {
            [VehicleType.MOTORCYCLE]: 20,
            [VehicleType.CAR]: 40,
            [VehicleType.VAN]: 60
        }
    }
    calculateFee(ticket: Ticket, exitTime: number): number {
        const parkingSpot = ticket.getParkingSpot();
        const vehicleType = parkingSpot.getSpotType();
        const rate = this._rates[vehicleType];
        return rate;
    }
}