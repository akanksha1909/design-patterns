import type { FileSystemNode } from "../composite/FileSystemNode.js";
import type { InMemoryFileSystem } from "../InMemoryFileSystem.js";
import type { Command } from "./Command.js";

export class TouchCommand implements Command {
    private fs: InMemoryFileSystem;
    private path: string;

    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }

    execute() {
        this.fs.createFile(this.path);
    }
}