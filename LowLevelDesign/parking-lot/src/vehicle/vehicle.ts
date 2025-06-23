export abstract class Vehicle {
    private readonly _licenseNo;
    constructor(licenseNumber: string) {
        this._licenseNo = licenseNumber;
    }

    get licenseNo(): string {
        return this._licenseNo;
    }
}