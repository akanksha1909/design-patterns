import { IndividualEmployee } from "./IndividualEmployee";
import { ManagerEmployee } from "./ManagerEmployee";
import { OrgComponent } from "./OrgComponent";
import { EmployeeRepository } from "./EmployeeRepository";

export class OrganisationManager {
    private static _instance: OrganisationManager;
    private roots: OrgComponent[];
    private nodesById: Map<number, OrgComponent>;
    private repository: EmployeeRepository;
    private loaded: boolean;

    private constructor() {
        this.roots = [];
        this.nodesById = new Map();
        this.repository = new EmployeeRepository();
        this.loaded = false;
    }

    public static getInstance() {
        if (!OrganisationManager._instance) {
            OrganisationManager._instance = new OrganisationManager();
        }
        return OrganisationManager._instance;
    }

    async initDB(): Promise<void> {
        await this.repository.createTable();
    }

    private async ensureLoaded(): Promise<void> {
        if (!this.loaded) {
            await this.loadFromDB();
            this.loaded = true;
        }
    }

    private async loadFromDB(): Promise<void> {
        const employees = await this.repository.getAllEmployees();
        const employeeMap = new Map<number, OrgComponent>();

        // Create all employees
        for (const emp of employees) {
            let employee: OrgComponent;
            if (emp.type === 'manager') {
                employee = new ManagerEmployee(emp.id, emp.name, emp.title);
            } else {
                employee = new IndividualEmployee(emp.id, emp.name, emp.title);
            }
            employeeMap.set(emp.id, employee);
            this.nodesById.set(emp.id, employee);
        }

        // Build hierarchy
        for (const emp of employees) {
            if (emp.manager_id) {
                const manager = employeeMap.get(emp.manager_id);
                const employee = employeeMap.get(emp.id);
                if (manager && employee && manager instanceof ManagerEmployee) {
                    manager.add(employee);
                }
            } else {
                // Root
                this.roots.push(employeeMap.get(emp.id)!);
            }
        }
    }

    async addRootEmployee(id: number, name: string, title: string): Promise<ManagerEmployee> {
        const rootEmployee = new ManagerEmployee(id, name, title);
        this.roots.push(rootEmployee);
        this.nodesById.set(id, rootEmployee);
        await this.repository.saveEmployee({ id, name, title, type: 'manager' });
        return rootEmployee;
    }

    async addManagerEmployee(id: number, name: string, title: string): Promise<ManagerEmployee> {
        const manager = new ManagerEmployee(id, name, title);
        this.nodesById.set(id, manager);
        await this.repository.saveEmployee({ id, name, title, type: 'manager' });
        return manager;
    }

    async addIndividualEmployee(id: number, name: string, title: string): Promise<OrgComponent> {
        const employee = new IndividualEmployee(id, name, title);
        this.nodesById.set(id, employee);
        await this.repository.saveEmployee({ id, name, title, type: 'individual' });
        return employee;
    }

    async addSubordinate(manager: ManagerEmployee, employee: OrgComponent): Promise<void> {
        manager.add(employee);
        await this.repository.updateEmployeeManager(employee.id, manager.id);
    }

    async getAllSubordinates(managerId: number): Promise<string[]> {
        await this.ensureLoaded();
        const manager = this.nodesById.get(managerId);
        if (!manager) return [];
        const stack = [...manager.getChildren()];
        const result: string[] = [];
        while (stack.length) {
            const node = stack.pop()!;
            result.push(node.name);
            if (node instanceof ManagerEmployee) {
                stack.push(...node.getChildren());
            }
        }
        return result;
    }
}