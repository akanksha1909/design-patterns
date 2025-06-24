import { FeeStrategy } from "./fee/fee-strategy";
import { FlatFee } from "./fee/flat-fee";
import { ParkingFloor } from "./parking-floor";
import { ParkingTicket } from "./parking-ticket";
import { PaymentStategy } from "./payment/payment-stratgey";
import { Vehicle } from "./vehicle/vehicle";

export class ParkingLot {
    private static _instance: ParkingLot;
    private readonly _floors: ParkingFloor[];
    private readonly _activeTickets: Set<ParkingTicket>;
    private readonly _feeStrategy: FeeStrategy;

    private constructor() {
        this._floors = [];
        this._activeTickets = new Set();
        this._feeStrategy = new FlatFee();
    }

    static getInstance() {
        if (!ParkingLot._instance) {
            ParkingLot._instance = new ParkingLot();
        }
        return ParkingLot._instance;
    }

    addFloor(floor: ParkingFloor) {
        this._floors.push(floor);
    }

    parkVehicle(vehicle: Vehicle): ParkingTicket {
        for (const floor of this._floors) {
            const spot = floor.getParkingSpot(vehicle.vehicleType);
            if (spot) {
                spot.park(vehicle);
                const ticket = new ParkingTicket(vehicle, spot);
                this._activeTickets.add(ticket);
                return ticket;
            }
        }
        throw new Error('No available parking spot!');
    }

    unParkVehicle(ticket: ParkingTicket, paymentStrategy: PaymentStategy) {
        if (!this._activeTickets.has(ticket)) {
            throw new Error('Invalid Ticket!');
        }
        this._activeTickets.delete(ticket);
        const spot = ticket.parkingSpot;
        spot.unpark();
        ticket.setExit();
        const fee = this._feeStrategy.calculateFee(ticket);
        paymentStrategy.makePayment(fee);
    }
}