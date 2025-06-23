import { Car } from "./car";
import { Bike } from "./bike";

export class VehicleFactory {

    createVehicle(vehicleType: string, licenseNumber: string) {
        if (vehicleType == 'car') {
            return new Car(licenseNumber);
        } else if (vehicleType == 'bike') {
            return new Bike(licenseNumber);
        } else {
            throw new Error(`Vehicle type '${vehicleType}' is not supported`);
        }
    }
}