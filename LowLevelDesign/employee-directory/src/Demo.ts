import { OrganisationManager } from "./OrganisationManager"

class Demo {
    async run() {
        console.log("Employee Organisation Demo")
        const organisationManager = OrganisationManager.getInstance()

        await organisationManager.initDB()

        const ceo = await organisationManager.addRootEmployee(1, "Anita", "CEO")

        const vpEngineeringManager = await organisationManager.addManagerEmployee(2, "Rahul", "VP Engineering")
        const vpSalesManager = await organisationManager.addManagerEmployee(3, "Meera", "VP Sales")
        const engineeringManager = await organisationManager.addManagerEmployee(4, "Ishaan", "Engineering Manager")
        const sde2Employee = await organisationManager.addIndividualEmployee(5, "Neha", "SDE-2")
        const sde1Employee = await organisationManager.addIndividualEmployee(6, "Aman", "SDE-1")
        const salesEmployee = await organisationManager.addIndividualEmployee(7, "Karan", "Sales Executive")

        await organisationManager.addSubordinate(ceo, vpEngineeringManager)
        await organisationManager.addSubordinate(ceo, vpSalesManager)

        await organisationManager.addSubordinate(vpEngineeringManager, engineeringManager)
        await organisationManager.addSubordinate(engineeringManager, sde2Employee)
        await organisationManager.addSubordinate(engineeringManager, sde1Employee)

        await organisationManager.addSubordinate(vpSalesManager, salesEmployee)
        console.log(await organisationManager.getAllSubordinates(2))

    }
}

new Demo().run()