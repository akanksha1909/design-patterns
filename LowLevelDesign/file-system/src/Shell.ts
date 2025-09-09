import { Command } from "./command/Command";
import { MkdirCommand } from "./command/MkdirCommand";
import { PwdCommand } from "./command/PwdCommand";
import { InMemoryFileSystem } from "./InMemoryFileSystem";

export class Shell {
    private fs: InMemoryFileSystem;
    constructor() {
        this.fs = InMemoryFileSystem.getInstance();
    }

    executeCommand(input: string) {
        console.log(`Executing command: ${input}`);
        const parts = input.split(" ");
        const commandName = parts[0];

        console.log(parts)

        let command: Command;

        switch (commandName) {
            case "pwd":
                command = new PwdCommand(this.fs);
                break;
            case "mkdir":
                command = new MkdirCommand(this.fs, parts[1]);
                break;
            default:
                console.log(`Command not found: ${commandName}`);
        }

        command.execute();
    }
}