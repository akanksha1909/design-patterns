import { ParkingSpot } from "../parking/parking-spot";
import { Vehicle } from "../vehicle/vehicle";
import { ParkingTicket } from "./parking-ticket";

export class TicketManager {
    private readonly _activeTickets = new Set<ParkingTicket>();

    createTicket(vehicle: Vehicle, spot: ParkingSpot): ParkingTicket {
        const ticket = new ParkingTicket(vehicle, spot);
        this._activeTickets.add(ticket);
        return ticket;
    }

    removeTicket(ticket: ParkingTicket): void {
        if (!this._activeTickets.has(ticket)) {
            throw new Error('Ticket not found in active tickets. Unable to remove.')
        }
        this._activeTickets.delete(ticket);
        ticket.setExit();
    }
}
