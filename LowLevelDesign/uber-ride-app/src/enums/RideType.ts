/**
 * Ride type configuration
 */
export interface RideTypeConfig {
    displayName: string;
    priceMultiplier: number;
}

/**
 * Enum representing different types of rides available
 */
export const RideType: Record<string, RideTypeConfig> = {
    ECONOMY: { displayName: 'Economy', priceMultiplier: 1.0 },
    PREMIUM: { displayName: 'Premium', priceMultiplier: 1.5 },
    LUXURY: { displayName: 'Luxury', priceMultiplier: 2.0 },
    POOL: { displayName: 'Pool', priceMultiplier: 0.7 },
    XL: { displayName: 'XL', priceMultiplier: 1.3 }
} as const;

export type RideTypeKey = keyof typeof RideType;

