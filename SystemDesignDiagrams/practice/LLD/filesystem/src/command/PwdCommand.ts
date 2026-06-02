import type { InMemoryFileSystem } from '../InMemoryFileSystem.js';
import type { Command } from './Command.js';

export class PwdCommand implements Command {
    private fs: InMemoryFileSystem;
    constructor(fs: InMemoryFileSystem) {
        this.fs = fs;
    }
    execute() {
        console.log("Current Directory", this.fs.getCurrentDirectory().getName());
    }
}