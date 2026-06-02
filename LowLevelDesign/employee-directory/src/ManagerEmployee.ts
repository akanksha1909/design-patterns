import { OrgComponent } from "./OrgComponent";

export class ManagerEmployee extends OrgComponent {
    private children: OrgComponent[];
    constructor(id, name, title) {
        super(id, name, title);
        this.children = []
    }

    add(employee) {
        this.children.push(employee)
    }

    getChildren() {
        return this.children
    }
}