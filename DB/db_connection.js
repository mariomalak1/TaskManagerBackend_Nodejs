import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({path: "config.env"})

export const sequelize = new Sequelize(
    "task_manager_backend_nodejs",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

export const dbConnection = async () => {
    try {
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
} 
