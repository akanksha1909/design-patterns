import { FileSystemNode } from "./FileSystemNode.js";

export class Directory extends FileSystemNode {
    private children: Map<string, FileSystemNode>;

    constructor(name: string, parent: Directory | null) {
        super(name, parent);
        this.children = new Map();
    }

    public addChild(node: FileSystemNode) {
        this.children.set(node.getName(), node);
    }

    public getChild(name: string): FileSystemNode | undefined {
        return this.children.get(name);
    }

    public getChildren() {
        return this.children;
    }
}