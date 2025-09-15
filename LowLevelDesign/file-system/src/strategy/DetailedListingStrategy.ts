import { Directory } from "../composite/Directory";
import { ListingStrategy } from "./ListingStrategy";

export class DetailedListingStrategy implements ListingStrategy {
    public list(directory: Directory): void {
        for (const node of directory.getChildren().values()) {
            const type = node instanceof Directory ? "d" : "f";
            console.log(`${type}\t${node.getName()}\t${node.getCreatedTime()}`);
        }
    }

}