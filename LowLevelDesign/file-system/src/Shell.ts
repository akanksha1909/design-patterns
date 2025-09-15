import { CatCommand } from "./command/CatCommand";
import { CdCommand } from "./command/CdCommand";
import { Command } from "./command/Command";
import { EchoCommand } from "./command/EchoCommand";
import { lsCommand } from "./command/lsCommand";
import { MkdirCommand } from "./command/MkdirCommand";
import { PwdCommand } from "./command/PwdCommand";
import { TouchCommand } from "./command/TouchCommand";
import { InMemoryFileSystem } from "./InMemoryFileSystem";
import { DetailedListingStrategy } from "./strategy/DetailedListingStrategy";
import { ListingStrategy } from "./strategy/ListingStrategy";
import { SimpleListingStrategy } from "./strategy/SimpleListingStrategy";

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
            case "ls":
                command = new lsCommand(this.fs, this.getPathArgumentForLs(parts), this.getListingStrategy(parts));
                break;
            case "cd":
                command = new CdCommand(this.fs, parts[1]);
                break;
            case "touch":
                command = new TouchCommand(this.fs, parts[1]);
                break;
            case "echo":
                command = new EchoCommand(this.fs, this.getEchoContent(input), this.getEchoFilePath(parts));
                break;
            case "cat":
                command = new CatCommand(this.fs, parts[1]);
                break;
            default:
                console.log(`Command not found: ${commandName}`);
        }

        command.execute();
    }


    private getEchoContent(input: string): string {
        try {
            const start = input.indexOf("'");
            const end = input.lastIndexOf("'");

            if (start !== -1 && end !== -1 && end > start) {
                return input.substring(start + 1, end);
            }
            return "";
        } catch {
            return "";
        }
    }

    private getEchoFilePath(parts: string[]): string {
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === ">" && i + 1 < parts.length) {
                return parts[i + 1];
            }
        }
        return ""; // Should be handled by argument check
    }


    private getListingStrategy(args: string[]): ListingStrategy {
        if (args.includes("-l")) {
            return new DetailedListingStrategy();
        }
        return new SimpleListingStrategy();
    }

    private getPathArgumentForLs(parts: string[]): string | null {
        // Find the first argument that is not an option flag
        const arg = parts
            .slice(1) // Skip the command name itself
            .find((part) => !part.startsWith("-"));

        return arg ?? null; // Return null if no path argument is found
    }

}