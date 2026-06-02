import type { InMemoryFileSystem } from '../InMemoryFileSystem.js';
import type { ListingStrategy } from '../strategy/ListingStrategy.js';
import type { Command } from './Command.js';

export class lsCommand implements Command {
    private fs: InMemoryFileSystem;
    private listingStrategy: ListingStrategy;
    private path: string | null;

    constructor(fs: InMemoryFileSystem, path: string | null, listingStrategy: ListingStrategy) {
        this.fs = fs;
        this.listingStrategy = listingStrategy;
        this.path = path;
    }
    execute() {
        console.log("Listing Directory");
        if (this.path == null) {
            this.fs.listContents(this.listingStrategy)
        } else {
            this.fs.listContents(this.listingStrategy, this.path);
        }
    }
}