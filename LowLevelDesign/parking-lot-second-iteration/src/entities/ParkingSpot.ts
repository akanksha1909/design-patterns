import { ParkingSpotType } from "../enums/ParkingSpotType";
import { v4 as uuidv4 } from 'uuid';

export class ParkingSpot {
    private _id: string;
    private _spotType: ParkingSpotType;

    constructor(spotType: ParkingSpotType) {
        this._id = uuidv4();
        this._spotType = spotType;
    }

    public getId(): string {
        return this._id;
    }

    public getSpotType(): ParkingSpotType {
        return this._spotType;
    }
}