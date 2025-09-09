import { Url } from "../Url";

export interface AnalyticsConsumer {
    onExpiry(url: Url): void;
}