import { Directory } from "../composite/Directory";
import { ListingStrategy } from "./ListingStrategy";

export class SimpleListingStrategy implements ListingStrategy {
    public list(directory: Directory): void {
        const names = Array.from(directory.getChildren().keys());
        console.log(names.join("  ") + "\n");
    }

}