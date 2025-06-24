import { Vehicle } from "./vehicle";
import { VehicleType } from "./vehicle-type";

export class Bike extends Vehicle{
    constructor(licenseNo: string) {
        super(licenseNo, VehicleType.BIKE)
    }
}