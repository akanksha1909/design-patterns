import { Directory } from "./Directory";

export abstract class FileSystemNode {
    
    protected name: String;
    protected parent: Directory;

    constructor(name: String, parent: Directory) {
        this.name = name;
        this.parent = parent;
    }

    public getPath(): string {
        if(this.parent == null) {
            return this.name.toString();
        }
        return this.parent.getPath() + "/" + this.name.toString();
    }

}