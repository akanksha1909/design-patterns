import { MkdirCommand } from "./command/MkdirCommand.js";
import { PwdCommand } from "./command/PwdCommand.js";
import { lsCommand } from "./command/lsCommand.js";
import { InMemoryFileSystem } from "./InMemoryFileSystem.js";
import { DetailedListingStrategy } from "./strategy/DetailedListingStrategy.js";
import { SimpleListingStrategy } from "./strategy/SimpleListingStrategy.js";
import { CdCommand } from "./command/CdCommand.js";
import { TouchCommand } from "./command/TouchCommand.js";

export class Shell {
    private fs: InMemoryFileSystem;
    constructor() {
        this.fs = InMemoryFileSystem.getInstance();
    }

    public executeCommand(input: string) {
        const parts = input.split(" ");
        let command;
        switch (parts[0]) {
            case "pwd": {
                command = new PwdCommand(this.fs)
                break;
            }
            case "mkdir": {
                if (!parts[1]) {
                    console.log("Usage: mkdir <directory-name>");
                    return;
                }
                command = new MkdirCommand(this.fs, parts[1]);
                break;
            }
            case "ls": {
                command = new lsCommand(this.fs, this.getArgumentsForLs(parts), this.getListingStrategy(parts));
                break;
            }
            case "cd": {
                command = new CdCommand(this.fs, parts[1]);
                break;
            }
            case "touch": {
                if (!parts[1]) {
                    console.log("Usage: touch <file-name>");
                    return;
                }
                command = new TouchCommand(this.fs, parts[1]);
                break;
            }
            default: {
                console.log("Invalid Command");
                break;
            }

        }
        if (command) {
            command.execute();
        }
    }

    private getListingStrategy(args: string[]) {
        if (args.includes("-l")) {
            return new DetailedListingStrategy()
        }
        return new SimpleListingStrategy()
    }

    private getArgumentsForLs(parts: string[]) {
        const args = parts.slice(1).find((path: string) => !path.startsWith("-"));
        return args ?? null;
    }
}