import { ParkingSpot } from "../parking/parking-spot";
import { Vehicle } from "../vehicle/vehicle";
import { ParkingTicket } from "./parking-ticket";

export class TicketManager {
    private readonly _activeTickets = new Set();
    constructor() {

    }

    createTicket(vehicle: Vehicle, spot: ParkingSpot): ParkingTicket {
        const ticket = new ParkingTicket(vehicle, spot);
        this._activeTickets.add(ticket);
        return ticket;
    }

    removeTicket(ticket: ParkingTicket): void {
        if (!this._activeTickets.has(ticket)) {
            throw new Error('Invalid Ticket!');
        }
        this._activeTickets.delete(ticket);
        ticket.setExit();
    }
}
