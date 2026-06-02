import { IndividualEmployee } from "./composite/IndividualEmployee";
import { ManagerEmployee } from "./composite/ManagerEmployee";
import { EmployeeRepository } from "./EmployeeRepository";

export class EmployeeDatabaseManager {
    private static _instance: EmployeeDatabaseManager;
    private employeeRepository: EmployeeRepository;

    private constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    public static getInstance(): EmployeeDatabaseManager {
        if (!EmployeeDatabaseManager._instance) {
            EmployeeDatabaseManager._instance = new EmployeeDatabaseManager();
        }
        return EmployeeDatabaseManager._instance;
    }

    async addManagerEmployee(id: number, name: string, position: string): Promise<void> {
        // Implementation to add a manager employee to the database
        console.log(`Added manager employee: ID=${id}, Name=${name}, Position=${position}`);
        const newManager = new ManagerEmployee(id, name, position); // Example of creating a ManagerEmployee instance
        await this.employeeRepository.save(newManager); // Save the new manager to the repository
    }

    async addIndividualEmployee(id: number, name: string, position: string): Promise<void> {
        // Implementation to add an individual employee under a manager
        // Here you would typically find the manager by managerId and add the individual employee to that manager's list of employees
        const individualEmployee = new IndividualEmployee(id, name, position); // Example of creating an IndividualEmployee instance
        await this.employeeRepository.save(individualEmployee); // Save the new individual employee to the repository
    }

    async addSubOrdinate(managerId: number, employeeId: number): Promise<void> {
        await this.employeeRepository.addRelationship(managerId, employeeId);
    }

    async getAllSubordinates(managerId: number): Promise<any[]> {
        const manager = await this.employeeRepository.getById(managerId);
        if (!manager) return [];

        const stack = [...manager.getEmployees()];

        const result = [];
        while(stack.length > 0) {
            const currentEmployee = stack.pop();
            result.push(currentEmployee);
            if(currentEmployee instanceof ManagerEmployee) {
                stack.push(...currentEmployee.getEmployees());
            }
        }
        return result;
    }

}