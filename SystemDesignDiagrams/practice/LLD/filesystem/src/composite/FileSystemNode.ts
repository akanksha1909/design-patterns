import { Directory } from "./Directory.js";

export abstract class FileSystemNode {
    private name: string;
    private parent: Directory | null;
    private createdTime: Date;

    constructor(name: string, parent: Directory | null) {
        this.name = name;
        this.parent = parent;
        this.createdTime = new Date();
    }

    public getName(): string {
        return this.name;
    }

    public getParent(): Directory | null {
        return this.parent;
    }

    public getCreatedTime(): Date {
        return this.createdTime;
    }
}