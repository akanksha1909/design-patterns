import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { Command } from "./Command";

export class CdCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }

    execute(): void {
        this.fs.changeDirectory(this.path);
    }
}