import { Directory } from "./composite/Directory";
import { File } from "./composite/File";
import { FileSystemNode } from "./composite/FileSystemNode";

export class InMemoryFileSystem {
    private static instance: InMemoryFileSystem;
    private root: Directory;
    private currentDirectory: Directory;

    private constructor() {
        // Private constructor to prevent instantiation
        this.root = new Directory("/", null);
        this.currentDirectory = this.root;

    }

    public static getInstance(): InMemoryFileSystem {
        if (!InMemoryFileSystem.instance) {
            InMemoryFileSystem.instance = new InMemoryFileSystem();
        }
        return InMemoryFileSystem.instance;
    }

    public getWorkingDirectory(): string {
        return this.currentDirectory.getPath();
    }

    public createDirectory(path: string) {
        this.createNode(path, true);
    }

    private createNode(path: string, isDirectory: Boolean): Directory {
        console.log(`Creating ${isDirectory ? "directory" : "file"} at path: ${path}`);
        console.log(`Current working directory: ${this.currentDirectory.name}`);
        let name: string;
        let parent: Directory;
        if (path.includes("/")) {
            const lastSlashIndex = path.lastIndexOf("/");
            name = path.substring(lastSlashIndex + 1);
            let parentPath = path.substring(0, lastSlashIndex);
            if (parentPath === "") {
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

        if (name == "") {
            console.error("Invalid name for file or directory");
            return;
        }

        if (parent.getChild(name)) {
            console.log(
                `Error: Node '${name}' already exists in '${parent.getPath()}'.`
            );
            return;
        }

        const newNode = isDirectory ? new Directory(name, parent) : new File(name, parent);
        parent.addChild(newNode);
    }

    private getNode(path: string): FileSystemNode  | undefined {
        console.log(`Getting node at path: ${path}`);
        console.log(`Current working directory: ${this.currentDirectory.name}`);
        if (path === "/") {
            return this.root;
        }

        let current: FileSystemNode = path.startsWith("/") ? this.root : this.currentDirectory;
        const parts = path.split("/").filter(part => part.length > 0);
        for (const part of parts) {
            if (part === ".") {
                continue;
            }

            if (!(current instanceof Directory)) {
                throw new Error(`Path ${path} is invalid`);
            }

            if (part == "..") {
                current = current.parent ?? this.root; // go up, but not above root
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
}