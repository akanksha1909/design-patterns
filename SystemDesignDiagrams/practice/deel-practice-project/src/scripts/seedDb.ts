import { sequelize } from "../config/database.js";
import { Profile } from "../models/profile.model.js";
import { Contract } from "../models/contract.model.js";
import { Job } from "../models/job.model.js";


async function seed() {
    console.log("Starting database seeding...");
    try {
        await sequelize.sync({ force: true });
        const transaction = await sequelize.transaction();
        try {

            await Profile.bulkCreate(
                [
                    {
                        id: 1,
                        firstName: "Harry",
                        lastName: "Potter",
                        profession: "Wizard",
                        balance: 1150,
                        type: "client",
                    },
                    {
                        id: 2,
                        firstName: "Mr",
                        lastName: "Robot",
                        profession: "Hacker",
                        balance: 231.11,
                        type: "client",
                    },
                    {
                        id: 3,
                        firstName: "John",
                        lastName: "Snow",
                        profession: "Knows nothing",
                        balance: 451.3,
                        type: "client",
                    },
                    {
                        id: 4,
                        firstName: "Ash",
                        lastName: "Ketchum",
                        profession: "Pokemon master",
                        balance: 1.3,
                        type: "client",
                    },
                    {
                        id: 5,
                        firstName: "John",
                        lastName: "Lenon",
                        profession: "Musician",
                        balance: 64,
                        type: "contractor",
                    },
                    {
                        id: 6,
                        firstName: "Linus",
                        lastName: "Torvalds",
                        profession: "Programmer",
                        balance: 1214,
                        type: "contractor",
                    },
                    {
                        id: 7,
                        firstName: "Alan",
                        lastName: "Turing",
                        profession: "Programmer",
                        balance: 22,
                        type: "contractor",
                    },
                    {
                        id: 8,
                        firstName: "Aragorn",
                        lastName: "II Elessar",
                        profession: "Fighter",
                        balance: 314,
                        type: "contractor",
                    },
                ],
                { transaction }
            );
            console.log("Profile data inserted successfully.");

            await Contract.bulkCreate(
                [
                    {
                        id: 1,
                        terms: "bla bla bla",
                        status: "terminated",
                        ClientId: 1,
                        ContractorId: 5,
                    },
                    {
                        id: 2,
                        terms: "bla bla bla",
                        status: "in_progress",
                        ClientId: 1,
                        ContractorId: 6,
                    },
                    {
                        id: 3,
                        terms: "bla bla bla",
                        status: "in_progress",
                        ClientId: 2,
                        ContractorId: 6,
                    },
                    {
                        id: 4,
                        terms: "bla bla bla",
                        status: "in_progress",
                        ClientId: 2,
                        ContractorId: 7,
                    },
                    {
                        id: 5,
                        terms: "bla bla bla",
                        status: "new",
                        ClientId: 3,
                        ContractorId: 8,
                    },
                ],
                { transaction }
            );
            console.log("Contract data inserted successfully.");

            await Job.bulkCreate(
                [
                    { description: "work", price: 200, ContractId: 1 },
                    { description: "work", price: 201, ContractId: 2 },
                    { description: "work", price: 202, ContractId: 3 },
                    { description: "work", price: 200, ContractId: 4 },
                    { description: "work", price: 200, ContractId: 5 },
                    {
                        description: "work",
                        price: 2020,
                        paid: true,
                        paymentDate: new Date("2020-08-15T19:11:26.737Z"),
                        ContractId: 5,
                    },
                    {
                        description: "work",
                        price: 200,
                        paid: true,
                        paymentDate: new Date("2020-08-15T19:11:26.737Z"),
                        ContractId: 2,
                    },
                    {
                        description: "work",
                        price: 200,
                        paid: true,
                        paymentDate: new Date("2020-08-16T19:11:26.737Z"),
                        ContractId: 3,
                    },
                    {
                        description: "work",
                        price: 200,
                        paid: true,
                        paymentDate: new Date("2020-08-17T19:11:26.737Z"),
                        ContractId: 1,
                    },
                    {
                        description: "work",
                        price: 200,
                        paid: true,
                        paymentDate: new Date("2020-08-17T19:11:26.737Z"),
                        ContractId: 5,
                    },
                ],
                { transaction }
            );

            console.log("Job data inserted successfully.");
            await transaction.commit();
            console.log("Database seeded successfully!");
        } catch (error) {
            await transaction.rollback();
            console.error("Seeding failed (transaction rolled back):", error);
            process.exit(1);
        }
    } catch (error) {
        console.log("Seeding failed...")
        process.exit(1);
    }
}

seed();