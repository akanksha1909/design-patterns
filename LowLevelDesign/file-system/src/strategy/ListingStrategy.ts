import { Directory } from "../composite/Directory";

export interface ListingStrategy {
    list(directory: Directory): void;
}