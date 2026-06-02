import { EmployeeComponent } from "./EmployeeComponent";

export class ManagerEmployee extends EmployeeComponent {
    private children: EmployeeComponent[];
    constructor(id: number, name: string, position: string) {
        super(id, name, position);
        this.children = [];
    }

    addEmployee(employee: EmployeeComponent): void {
        this.children.push(employee);
    }

    getEmployees(): EmployeeComponent[] {
        return this.children;
    }
}