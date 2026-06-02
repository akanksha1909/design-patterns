import { Directory } from "../composite/Directory.js";

export interface ListingStrategy {
    list(directory: Directory): void;
}