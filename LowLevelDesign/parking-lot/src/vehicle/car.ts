import { Vehicle } from "./vehicle";
import { VehicleType } from "./vehicle-type";

export class Car extends Vehicle {
    constructor(licenseNo: string) {
        super(licenseNo, VehicleType.CAR)
    }
}