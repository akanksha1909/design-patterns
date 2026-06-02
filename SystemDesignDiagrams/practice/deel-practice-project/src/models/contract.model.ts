import { Association, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import type { Profile } from "./profile.model.js";
import type { Job } from "./job.model.js";


// extends Model means it inherits Sequelize’s ORM functionality (findAll, create, update, etc.)
export class Contract extends Model {
    // ! tells typescript that I promise this property will be assigned before it is used
    public id!: number;
    public term!: string;
    public status!: "new" | "in_progress" | "terminated";
    public ClientId!: number;
    public ContracterId!: number;

    public static associations: {
        Client: Association<Contract, Profile>;
        Contractor: Association<Contract, Profile>;
        Jobs: Association<Contract, Job>;
    };

    public static associate(models: any) {
        this.belongsTo(models.Profile, { as: "Client", foreignKey: "ClientId" });
        this.belongsTo(models.Profile, { as: "Contractor", foreignKey: "ContracterId" });
        // One to many relationship, Contract can have multiple jobs
        this.hasMany(models.Job, { as: "Jobs", foreignKey: "ContractId" });
    }
}

Contract.init(
    {
        terms: { type: DataTypes.TEXT },
        status: { type: DataTypes.ENUM("new", "in_progress", "terminated") }
    }, {
        sequelize,
        modelName: 'Contract'
    }
);