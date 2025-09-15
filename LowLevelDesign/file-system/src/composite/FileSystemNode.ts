import { Directory } from "./Directory";

export abstract class FileSystemNode {
  protected name: string;
  protected parent: Directory | null;
  protected createdTime: Date;

  constructor(name: string, parent: Directory | null) {
    this.name = name;
    this.parent = parent;
    this.createdTime = new Date();
  }

  public getPath(): string {
    if (this.parent === null) {
      // Root directory
      return this.name;
    }
    // Avoid double slash for root's children
    if (this.parent.getParent() === null) {
      return this.parent.getPath() + this.name;
    }
    return this.parent.getPath() + "/" + this.name;
  }

  // Getters and Setters
  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getParent(): Directory | null {
    return this.parent;
  }

  public getCreatedTime(): Date {
    return this.createdTime;
  }
}
