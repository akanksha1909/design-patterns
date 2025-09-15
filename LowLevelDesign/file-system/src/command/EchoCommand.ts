import { InMemoryFileSystem } from "../InMemoryFileSystem";
import { Command } from "./Command";

export class EchoCommand implements Command {
    fs: InMemoryFileSystem;
    path: string;
    content: string;
    constructor(fs: InMemoryFileSystem, content: string, path: string) {
        this.fs = fs;
        this.path = path;
        this.content = content;
    }

    execute(): void {
        this.fs.writeToFile(this.path, this.content);
    }
}