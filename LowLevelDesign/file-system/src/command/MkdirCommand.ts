import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { Command } from "./Command";

export class MkdirCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }

    execute(): void {
        console.log("Hello from Mkdir Command");
        this.fs.createDirectory(this.path);
    }
}