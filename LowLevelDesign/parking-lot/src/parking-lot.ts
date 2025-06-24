import { FeeStrategy } from "./fee/fee-strategy";
import { FlatFee } from "./fee/flat-fee";
import { ParkingFloor } from "./parking/parking-floor";
import { ParkingTicket } from "./ticket/parking-ticket";
import { PaymentStrategy } from "./payment/payment-strategy";
import { Vehicle } from "./vehicle/vehicle";
import { TicketManager } from "./ticket/ticket-manager";
import { ParkingManager } from "./parking/parking-manager";


export class ParkingLot {
    private static _instance: ParkingLot;
    private readonly _feeStrategy: FeeStrategy;
    private readonly _ticketManager: TicketManager;
    private _parkingManager!: ParkingManager;


    private constructor() {
        this._ticketManager = new TicketManager();
        this._feeStrategy = new FlatFee();
    }

    static getInstance() {
        if (!ParkingLot._instance) {
            ParkingLot._instance = new ParkingLot();
        }
        return ParkingLot._instance;
    }

    setParkingManager(manager: ParkingManager) {
        this._parkingManager = manager;
    }

    parkVehicle(vehicle: Vehicle): ParkingTicket {
        const spot = this._parkingManager.findSpot(vehicle.vehicleType);
        if (spot) {
            spot.park(vehicle);
            return this._ticketManager.createTicket(vehicle, spot);
        }
        throw new Error('No available parking spot!');
    }

    unParkVehicle(ticket: ParkingTicket, paymentStrategy: PaymentStrategy) {
        this._ticketManager.removeTicket(ticket);
        const spot = ticket.parkingSpot;
        spot.unpark();
        ticket.setExit();
        const fee = this._feeStrategy.calculateFee(ticket);
        paymentStrategy.makePayment(fee);
    }
}