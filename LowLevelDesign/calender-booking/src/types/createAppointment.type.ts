export interface CreateAppointment {
    hostId: string;
    guestId: string;
    startTime: string;
    durationInMins: number;
    timezone: string;
}