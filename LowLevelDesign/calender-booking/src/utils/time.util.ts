// Luxon does not bundle its own TypeScript types, so you must install them separately.

import { DateTime } from 'luxon';

export function toUTC(localTime: string, timezone: string) {
    return DateTime.fromISO(localTime, { zone: timezone })
        .toUTC().toISO();
}

export function fromUTC(utcTime: string, timezone: string) {
    return DateTime.fromISO(utcTime, { zone: 'utc' })
        .setZone(timezone)
        .toISO();
}