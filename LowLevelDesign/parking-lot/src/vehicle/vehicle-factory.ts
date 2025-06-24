import { Car } from "./car";
import { Bike } from "./bike";
import { VehicleType } from "./vehicle-type";

export class VehicleFactory {

    static createVehicle(vehicleType: string, licenseNumber: string) {
        if (vehicleType === VehicleType.CAR) {
            return new Car(licenseNumber);
        } else if (vehicleType === VehicleType.BIKE) {
            return new Bike(licenseNumber);
        } else {
            throw new Error(`Vehicle type '${vehicleType}' is not supported`);
        }
    }
}