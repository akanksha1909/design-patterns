import { randomUUID } from "node:crypto";
import { Vehicle } from "../vehicle/vehicle";
import { ParkingSpot } from "../parking/parking-spot";

export class ParkingTicket {
    private readonly _entryTime: number;
    private _exitTime?: number;
    private readonly _ticketId: string;

    constructor(private _vehicle: Vehicle, private _parkingSpot: ParkingSpot) {
        this._ticketId = randomUUID();
        this._entryTime = Date.now();
    }

    get vehicle(): Vehicle {
        return this._vehicle;
    }

    get parkingSpot(): ParkingSpot {
        return this._parkingSpot;
    }

    get ticketId(): string {
        return this._ticketId;
    }

    get entryTime(): number {
        return this._entryTime;
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