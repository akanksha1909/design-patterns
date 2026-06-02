import { EmployeeDatabaseManager } from "./EmployeeDatabaseManager";

class Demo {
    async run(){
        const employeeDatabaseManager = EmployeeDatabaseManager.getInstance();

        // john Doe, CEO - 1
        // Jane Smith, VP Engineering - 2
        // Bob Johnson, VP Sales - 3
        // Alice Williams, Software Engineer - 4
        // Charlie Brown, Sales Associate - 5

        await employeeDatabaseManager.addManagerEmployee(1, "John Doe", "CEO");
        await employeeDatabaseManager.addManagerEmployee(2, "Jane Smith", "VP Engineering");
        await employeeDatabaseManager.addManagerEmployee(3, "Bob Johnson", "VP Sales");
        await employeeDatabaseManager.addIndividualEmployee(4, "Alice Williams", "Software Engineer");
        await employeeDatabaseManager.addIndividualEmployee(5, "Charlie Brown", "Sales Associate");

        await employeeDatabaseManager.addSubOrdinate(1, 2); // John Doe is the manager of Jane Smith
        await employeeDatabaseManager.addSubOrdinate(1, 3); // John Doe is the manager of Bob Johnson
        await employeeDatabaseManager.addSubOrdinate(2, 4); // Jane Smith is the manager of Alice Williams
        await employeeDatabaseManager.addSubOrdinate(3, 5); // Bob Johnson is the manager of Charlie Brown

        console.log(await employeeDatabaseManager.getAllSubordinates(1)); // Should return Jane Smith, Bob Johnson, Alice Williams, and Charlie Brown
        console.log(await employeeDatabaseManager.getAllSubordinates(2)); // Should return Alice Williams
        console.log(await employeeDatabaseManager.getAllSubordinates(3)); // Should return Charlie Brown
    }
}

(async () => {
    await new Demo().run();
})();