import { VehicleType } from "./vehicle-type";

export abstract class Vehicle {
    private readonly _licenseNo;
    private readonly _type: VehicleType;
    constructor(licenseNumber: string, vehicleType: VehicleType) {
        this._licenseNo = licenseNumber;
        this._type = vehicleType;
    }

    get licenseNo(): string {
        return this._licenseNo;
    }

    get vehicleType(): VehicleType {
        return this._type;
    }
}