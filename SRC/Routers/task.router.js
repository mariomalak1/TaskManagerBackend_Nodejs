import {Router} from "express";

import {getAllTasksForUser, getTaskWithId,
    createTask, updateTask, deleteTask,
    numberOfComUnComTasks,
    numberOfTasksCompeletedPerDayInMonth} from "../Controllers/task.controller.js";
import {verifyToken} from "../Utillis/userToken.js";

export const router = Router();

router.route("/")
    .get(verifyToken, getAllTasksForUser)
    .post(verifyToken, createTask)
    
router.route("/:id")
    .get(verifyToken, getTaskWithId)
    .put(verifyToken, updateTask)
    .delete(verifyToken, deleteTask);

router.get("/statistics/num/", verifyToken, numberOfComUnComTasks)
router.get("/statistics/nTasksInMonth/", verifyToken, numberOfTasksCompeletedPerDayInMonth)
