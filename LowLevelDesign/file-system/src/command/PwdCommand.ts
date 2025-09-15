import { Command } from "./Command";
import { InMemoryFileSystem } from "../InMemoryFileSystem";

export class PwdCommand implements Command {
    fs: InMemoryFileSystem;
    constructor(fs: InMemoryFileSystem) {
        this.fs = fs;
    }

    execute(): void {
        console.log("Executing Pwd Command");
        console.log(this.fs.getWorkingDirectory());
    }
}