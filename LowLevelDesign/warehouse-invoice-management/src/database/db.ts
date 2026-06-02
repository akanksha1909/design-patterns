import knex from "knex";

const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile");
const knexConfig = config[environment];

export const db = knex(knexConfig);

export default db;
