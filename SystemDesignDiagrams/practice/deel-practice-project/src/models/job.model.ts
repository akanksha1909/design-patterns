import { DataTypes, Model, Association, DECIMAL } from "sequelize";
import { sequelize } from "../config/database.js";
import type { Contract } from "./contract.model.js";

export class Job extends Model {
    public description!: string;
    public price!: number;
    public paid!: boolean;
    public paymentDate!: Date;
    public ContractId!: number;

    public static associations: {
        Contract: Association<Job, Contract>;
    };

    public static associate(models: any) {
        this.belongsTo(models.Contract, { foreignKey: "ContractId" });
    }
}

Job.init(
    {
        description: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        paid: { type: DataTypes.BOOLEAN, defaultValue: false },
        paymentDate: { type: DataTypes.DATE }
    },
    {
        sequelize,
        modelName: 'Job'
    }
);