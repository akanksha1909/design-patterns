import { FileSystemNode } from "./FileSystemNode";

export class Directory extends FileSystemNode {
    private children: Map<string, FileSystemNode>;

    constructor(public name: string, public parent: Directory | null) {
        super(name, parent);
        this.children = new Map<string, FileSystemNode>();
    }

    addChild(node: FileSystemNode): void {
        if (this.children.has(node['name'].toString())) {
            throw new Error(`Node with name ${node['name']} already exists in directory ${this.getPath()}`);
        }
        this.children.set(node['name'].toString(), node);
    }

    getChildren(): ReadonlyMap<string, FileSystemNode> {
        return this.children;
    }

    getChild(name: string): FileSystemNode | undefined {
        return this.children.get(name);
    }
}