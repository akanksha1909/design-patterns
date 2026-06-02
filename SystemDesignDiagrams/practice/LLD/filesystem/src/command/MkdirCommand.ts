import type { InMemoryFileSystem } from '../InMemoryFileSystem.js';
import type { Command } from './Command.js';

export class MkdirCommand implements Command {
    private fs: InMemoryFileSystem;
    private path: string;

    constructor(fs: InMemoryFileSystem, path: string) {
        this.fs = fs;
        this.path = path;
    }
    execute() {
        console.log("Making Directory");
        this.fs.createDirectory(this.path);
    }
}