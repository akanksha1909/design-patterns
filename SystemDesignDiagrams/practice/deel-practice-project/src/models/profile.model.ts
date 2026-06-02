import { Association, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import type { Contract } from "./contract.model.js";

export class Profile extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public profession!: string;
    public balance!: number;
    public type!: "client" | "contractor";

    public static associations: {
        ClientContracts: Association<Profile, Contract>;
        ContracterContracts: Association<Profile, Contract>;
    };

    public static associate(models: any) {
        this.hasMany(models.Contract, {
            as: "ClientContracts",
            foreignKey: "ClientId"
        });
        this.hasMany(models.Contract, {
            as: "ContracterContracts",
            foreignKey: "ContracterId"
        })
    }
}

Profile.init({
    firstName: { type: DataTypes.TEXT, allowNull: false },
    lastName: { type: DataTypes.TEXT, allowNull: false },
    profession: { type: DataTypes.TEXT, allowNull: false },
    balance: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    type: { type: DataTypes.ENUM('client', 'contractor') }
}, {
    sequelize,
    modelName: 'Profile'
})