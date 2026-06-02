import { FileSystemNode } from "./FileSystemNode.js";
import { Directory } from "./Directory.js";

export class FileNode extends FileSystemNode {
    private content: string;
    constructor(name: string, parent: Directory) {
        super(name, parent);
        this.content = "";
    }

    public getContent(): string {
        return this.content;
    }

    public setContent(content: string): void {
        this.content = content;
    }

}