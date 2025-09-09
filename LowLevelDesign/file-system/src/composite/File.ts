import { Directory } from "./Directory";
import { FileSystemNode } from "./FileSystemNode";

export class File extends FileSystemNode {
    private content: string;
    constructor(public name: string, public parent: Directory) {    
        super(name, parent);
        this.content = "";
    }

    public getContent(): string {
        return this.content
    }

    public setContent(content: string): void {
        this.content = content;
    }
}