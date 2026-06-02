import { Directory } from "./composite/Directory.js";
import { FileSystemNode } from "./composite/FileSystemNode.js";
import { FileNode } from './composite/FileNode.js';
import type { ListingStrategy } from "./strategy/ListingStrategy.js";

export class InMemoryFileSystem {
    private static instance: InMemoryFileSystem;
    private root: Directory;
    private currentDirectory: Directory;

    private constructor() {
        this.root = new Directory("/", null);
        this.currentDirectory = this.root;
    }

    public static getInstance() {
        if (!InMemoryFileSystem.instance) {
            InMemoryFileSystem.instance = new InMemoryFileSystem();
        }
        return InMemoryFileSystem.instance;
    }

    public getCurrentDirectory() {
        return this.currentDirectory;
    }

    public createDirectory(path: string) {
        this.createNode(path, true);
    }

    // mkdir home
    // mkdir /home/user
    // mkdir ../hello
    // mkdir ./hello

    public createNode(path: string, isDirectory: boolean) {
        let name: string;
        let parent: Directory;
        let current = this.currentDirectory;
        if (path.includes("/")) {
            name = path.substring(path.lastIndexOf("/") + 1, path.length);
            let parentPath = path.substring(0, path.lastIndexOf("/"));
            if (parentPath == "") {
                parentPath = "/";
            }
            const parentNode = this.getNode(parentPath);
            if (!(parentNode instanceof Directory)) {
                throw new Error("Parent is not a directory");
            }
            parent = parentNode;
        } else {
            name = path;
            parent = this.currentDirectory;
        }
        if (parent.getChild(name)) {
            console.log(
                `Error: Node '${name}' already exists'.`
            );
            return;
        }
        let node = isDirectory ? new Directory(name, parent) : new FileNode(name, parent);
        parent.addChild(node);
    }

    public getNode(path: string): FileSystemNode | undefined {
        if (path == "/") {
            return this.root;
        }
        let current: FileSystemNode = path.startsWith("/") ? this.root : this.currentDirectory;
        const parts = path.split("/").filter(part => part.length > 0);
        for (const part of parts) {
            if (part == ".") {
                continue;
            }
            if (!(current instanceof Directory)) {
                throw new Error(`Path ${path} is invalid`);
            }
            if (part == "..") {
                current = current.getParent() ?? this.root;
            } else {
                const child = current.getChild(part);
                if (!child) {
                    throw new Error(`Path ${path} is invalid`);
                }
                current = child;
            }
        }
        return current;
    }

    public listContents(strategy: ListingStrategy, path?: string) {
        if (!path) {
            strategy.list(this.currentDirectory);
            return;
        }
        const node = this.getNode(path);
        if (node instanceof Directory) {
            strategy.list(node)
        } else {
            console.log(node?.getName());
        }
    }

    public changeDirectory(path: string | undefined) {
        if (path == undefined) {
            return this.root;
        }
        const node = this.getNode(path);
        if (node instanceof Directory) {
            this.currentDirectory = node;
        } else {
            console.log(`Error: ${path} is not a directory`)
        }
    }

    public createFile(path: string) {
        this.createNode(path, false);
    }

    public readFile(path: string): string {
        const node = this.getNode(path);
        if(node instanceof FileNode) {
            return node.getContent();
        }
        console.log(`Error: Cannot read from ${path}. It is not a file or does not exist.`)
        return "";
    }
}