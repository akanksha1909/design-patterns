import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { ListingStrategy } from "../strategy/ListingStrategy";
import { Command } from "./Command";

export class lsCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    strategy: ListingStrategy;
    constructor(fs: InMemoryFileSystem, path: string, strategy: ListingStrategy) {
        this.fs = fs;
        this.path = path;
        this.strategy = strategy;

    }

    public execute(): void {
        if (this.path == null) {
            this.fs.listContents(this.strategy);
        } else {
            this.fs.listContents(this.strategy, this.path);
        }
    }

}