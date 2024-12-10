import {Op} from "sequelize";

import {TaskModel} from "../../DB/Models/task.model.js";
import {responseObjWithPaginator} from "../Utillis/defaultResponses.js";
import {paginate} from "../Utillis/paginationForModel.js";
import {ApiError} from "../Utillis/apiErrors.js";

export const getAllTasksForUser = async (req, res) => {
    // where clue that will put it in model     
    const whereClue = {
        UserId: req.user.id
    }
    
    const tasks = await paginate(req, TaskModel, whereClue);
    const response = responseObjWithPaginator(tasks);

    return res.status(200).json(response);
}

// @params  id -required
export const getTaskWithId = async (req, res, next) => {
    const {id} = req.params;

    if (!id) {
        return next(new ApiError("must provide task id", 400))
    }

    const task = await TaskModel.findByPk(id);
    
    if(!task){
        return res.sendStatus(404);
    }

    return res.status(200).json({data: task});
}


export const createTask = async (req, res, next) => {
    const {title} = req.body;

    if(!title){
        return res.status(400).json({"error": "must provide title"});
    }
    
    const task = await TaskModel.create({title, UserId: req.user.id});

    return res.status(200).json({
        data: task
    });
}

export const updateTask = async (req, res, next) => {
    const {id} = req.params;

    let task = await TaskModel.findByPk(id);

    if(!task){
        return res.sendStatus(404);
    }

    if(req.status !== null){
        if(req.status > 1 || req.status < 0){
            return res.status(400).json({"error": "status must be 0 or 1"});
        }
    
        task.status = req.body.status;

        // change complete time 
        if(req.body.status == 1){
            task.completeTime = new Date();
        }
    }

    task.title = req.body.title || task.title;

    task.save();

    return res.status(200).json({data: task});
}


export const deleteTask = async (req, res, next) => {
    const {id} = req.params;

    if (!id) {
        return next(new ApiError("must provide task id", 400))
    }

    const task = await TaskModel.findByPk(id);
    
    if(!task){
        return res.sendStatus(404);
    }

    await task.destroy();

    return res.status(204).json({data: task});
}


export const numberOfComUnComTasks = async (req, res, next) => {
    const numOfUnCompletedTasks = await TaskModel.findAll({
        where: {
            status: 0
        }
    });
    
    const numOfCompletedTasks = await TaskModel.findAll({
        where: {
            status: 1
        }
    });

    return res.status(200).json({data: {"numOfCompletedTasks": numOfCompletedTasks.length, "numOfUnCompletedTasks": numOfUnCompletedTasks.length}});
}

export const numberOfTasksCompeletedPerDayInMonth = async (req, res, next) => {
    let {month} = req.query;
    
    if(!month){
        return res.status(400).json({"error": "must provide month number"});
    }

    if(Number.isNaN(month) && (month > 11 || month < 0)){
        return res.status(400).json({"error": "must provide valid month number"});
    }

    const currentYear = new Date().getFullYear();

    month -= 1;
    
    let greaterThanData, smallerThanData;

    if(month == 0){
        greaterThanData = new Date(currentYear - 1, 11, 1);
    }else{
        greaterThanData = new Date(currentYear, month, 1);

    }

    if(month == 11){
        smallerThanData = new Date(currentYear + 1, 0, 1);        
    }else{
        smallerThanData = new Date(currentYear, month, 1);
    }


    const tasks = await TaskModel.findAll({
        where: {
            status: 1,
            completeTime: {
                [Op.gte]: greaterThanData,
                [Op.lt]: smallerThanData,
            }
        }
    });

    const numOfDaysInMonth = new Date(currentYear, 5, 0).getDate();

    const tasksPerDay = {};

    for (let i = 1; i < numOfDaysInMonth; i++) {
        tasksPerDay[`day_${i}`] = tasks.filter((task) => task.completeTime.getDate() === i);        
    }

    return res.status(200).json({data: {tasksPerDay}});
}

