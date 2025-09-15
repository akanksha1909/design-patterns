import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { Command } from "./Command";

export class CatCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }

    execute(): void {
        console.log(`File Content" : ${this.fs.readFile(this.path)};`)
    }
}