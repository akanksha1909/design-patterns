import { ParkingSpot } from "./ParkingSpot";
import { v4 as uuidv4 } from 'uuid';

export class Ticket {
    private _id: string;
    private _parkingSpot: ParkingSpot;
    private _entryTime: number;

    constructor(parkingSpot: ParkingSpot, entryTime: number) {
        this._id = uuidv4();
        this._parkingSpot = parkingSpot;
        this._entryTime = entryTime;
    }

    public getId(): string {
        return this._id;
    }

    public getParkingSpot(): ParkingSpot {
        return this._parkingSpot;
    }

    public getEntryTime(): number {
        return this._entryTime;
    }
}