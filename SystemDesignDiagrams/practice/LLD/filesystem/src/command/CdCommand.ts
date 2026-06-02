import type { InMemoryFileSystem } from "../InMemoryFileSystem.js";
import type { Command } from "./Command.js";

export class CdCommand implements Command {
    private fs: InMemoryFileSystem;
    private path: string | undefined;
    constructor(fs: InMemoryFileSystem, path: string | undefined) {
        this.fs = fs;
        this.path = path;
    }
    execute() {
        this.fs.changeDirectory(this.path);
    }
}