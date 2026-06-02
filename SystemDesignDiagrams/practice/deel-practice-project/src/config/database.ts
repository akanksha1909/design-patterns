import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
})


async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
    } catch(error) {
        console.log('Unable to connect to database!')
    }
}

export { sequelize, connectDB }