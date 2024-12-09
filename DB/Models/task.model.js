import {DataTypes} from "sequelize";

import {sequelize} from "../db_connection.js"; 


const TaskModel = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:{
                args: [2, 40],
                message: "task name must be between 2 and 20 characters long"
            }
        }
    },

    status:{
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: false,
    },

    completeTime: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});