import {DataTypes} from "sequelize";

import {sequelize} from "../db_connection.js"; 
import {UserModel} from "./user.model.js";

export const TaskModel = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:{
                args: [2, 40],
                message: "task name must be between 2 and 20 characters long",
            }
        }
    },

    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    completeTime: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

TaskModel.belongsTo(UserModel, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    foreignKey: {
        allowNull: false
    }
});

UserModel.hasMany(TaskModel);
