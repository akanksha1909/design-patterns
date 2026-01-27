import { VehicleType } from "./enums/VehicleType";
import { ParkingLotManager } from "./ParkingLotManager"

export class Demo {
    run() {
        const parkingLotManager = ParkingLotManager.getInstance();

        const carTicket = parkingLotManager.parkVehicle(VehicleType.CAR)
        parkingLotManager.parkVehicle(VehicleType.MOTORCYCLE)

        parkingLotManager.unParkVehicle(carTicket.getId())
    }
}

new Demo().run()