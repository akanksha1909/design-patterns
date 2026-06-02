import db, { createDatabaseIfNotExists } from './Database';

export interface EmployeeData {
  id: number;
  name: string;
  title: string;
  type: 'manager' | 'individual';
  manager_id?: number;
}

export class EmployeeRepository {
    
  async createTable(): Promise<void> {
    await createDatabaseIfNotExists();
    await db.schema.dropTableIfExists('employees');
    await db.schema.createTable('employees', (table) => {
      table.integer('id').primary();
      table.string('name').notNullable();
      table.string('title').notNullable();
      table.enu('type', ['manager', 'individual']).notNullable();
      table.integer('manager_id').nullable();
    });
  }

  async saveEmployee(employee: EmployeeData): Promise<void> {
    await db('employees').insert(employee);
  }

  async getAllEmployees(): Promise<EmployeeData[]> {
    return await db('employees').select('*');
  }

  async getEmployeeById(id: number): Promise<EmployeeData | undefined> {
    return await db('employees').where({ id }).first();
  }

  async updateEmployeeManager(employeeId: number, managerId: number): Promise<void> {
    await db('employees').where({ id: employeeId }).update({ manager_id: managerId });
  }

  async deleteAllEmployees(): Promise<void> {
    await db('employees').del();
  }
}