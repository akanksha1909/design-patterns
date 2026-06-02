import { EmployeeComponent } from "./composite/EmployeeComponent";
import { IndividualEmployee } from "./composite/IndividualEmployee";
import { ManagerEmployee } from "./composite/ManagerEmployee";
import knex from 'knex';
import knexConfig from '../knexfile';

export class EmployeeRepository {
    private db: knex.Knex;

    constructor() {
        this.db = knex(knexConfig.development);
    }

    async save(employee: EmployeeComponent): Promise<void> {
        const type = employee instanceof ManagerEmployee ? 'manager' : 'individual';
        await this.db('employees').insert({
            id: employee.id,
            name: employee.name,
            position: employee.position,
            type: type
        }).onConflict('id').merge(); // Upsert
    }

    async getById(id: number): Promise<EmployeeComponent | undefined> {
        const employeeData = await this.db('employees').where({ id }).first();
        if (!employeeData) return undefined;

        let employee: EmployeeComponent;
        if (employeeData.type === 'manager') {
            employee = new ManagerEmployee(employeeData.id, employeeData.name, employeeData.position);
            // Load subordinates
            const subordinatesData = await this.db('employee_relationships')
                .join('employees', 'employee_relationships.subordinate_id', 'employees.id')
                .where('employee_relationships.manager_id', id)
                .select('employees.*');

            for (const subData of subordinatesData) {
                const subordinate = await this.getById(subData.id);
                if (subordinate) {
                    employee.addEmployee(subordinate);
                }
            }
        } else {
            employee = new IndividualEmployee(employeeData.id, employeeData.name, employeeData.position);
        }

        return employee;
    }

    async addRelationship(managerId: number, subordinateId: number): Promise<void> {
        await this.db('employee_relationships').insert({
            manager_id: managerId,
            subordinate_id: subordinateId
        }).onConflict(['manager_id', 'subordinate_id']).ignore(); // Ignore if already exists
    }
}