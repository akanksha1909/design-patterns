import { randomUUID } from "node:crypto";
import { Vehicle } from "./vehicle/vehicle";
import { ParkingSpot } from "./parking-spot";

export class ParkingTicket {
    private readonly _entryTime: number;
    private _exitTime?: number;
    private readonly _ticketId: string;

    constructor(public vehicle: Vehicle, public parkingSpot: ParkingSpot) {
        this._ticketId = randomUUID();
        this._entryTime = Date.now();
    }

    setExit() {
        this._exitTime = Date.now();
    }

    getDuration() {
        if (!this._exitTime) {
            throw new Error('Parking still active!');
        }

        return this._exitTime - this._entryTime;
    }
}