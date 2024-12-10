import {DataTypes} from "sequelize";

import {sequelize} from "../db_connection.js"; 

export const UserModel = sequelize.define("User", {
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:{
                args: [2, 20], 
                message: "name must be between 2 and 20 characters long"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                message: "Please enter a valid email address"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:{
                args: [8, 60], 
                message: "Password must be between 8 and 60 characters long"
            }
        }
    }
});
