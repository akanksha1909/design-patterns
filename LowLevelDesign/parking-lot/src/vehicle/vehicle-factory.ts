import { Car } from "./car";
import { Bike } from "./bike";

export class VehicleFactory {

    static createVehicle(vehicleType: string, licenseNumber: string) {
        if (vehicleType === 'Car') {
            return new Car(licenseNumber);
        } else if (vehicleType === 'Bike') {
            return new Bike(licenseNumber);
        } else {
            throw new Error(`Vehicle type '${vehicleType}' is not supported`);
        }
    }
}