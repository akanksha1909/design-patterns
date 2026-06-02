export class OrgComponent {
    private _id: number;
    private _name: string;
    private _title: string;

    constructor(id: number, name: string, title: string) {
        this._id = id;
        this._name = name;
        this._title = title;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get title(): string {
        return this._title;
    }

    getChildren(): OrgComponent[] {
        return [];
    }
}