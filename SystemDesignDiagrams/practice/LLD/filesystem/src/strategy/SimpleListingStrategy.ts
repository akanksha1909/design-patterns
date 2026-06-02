import type { Directory } from "../composite/Directory.js";
import type { ListingStrategy } from "./ListingStrategy.js";

export class SimpleListingStrategy implements ListingStrategy {
    list(directory: Directory) {
        for (const key of directory.getChildren().keys()) {
            console.log(key, " ");
        }
    }
}