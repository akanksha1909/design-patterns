export class Product {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }

    public getId(): string {
        return this.name
    }
}