import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { Command } from "./Command";

export class TouchCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }

    execute(): void {
        this.fs.createFile(this.path);
    }
}