import { EmployeeComponent } from "./EmployeeComponent";

export class IndividualEmployee extends EmployeeComponent {
    constructor(id: number, name: string, position: string) {
        super(id, name, position);
    }
}