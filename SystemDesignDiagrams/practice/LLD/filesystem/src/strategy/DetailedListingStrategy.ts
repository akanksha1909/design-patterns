import { Directory } from "../composite/Directory.js";
import type { ListingStrategy } from "./ListingStrategy.js";

export class DetailedListingStrategy implements ListingStrategy {
    list(directory: Directory) {
        for(const node of directory.getChildren().values()) {
            const type = (node instanceof Directory) ? "d": "f";
            console.log(`${type} \t ${node.getName()}\t ${node.getCreatedTime()}`)
        }
    }
}