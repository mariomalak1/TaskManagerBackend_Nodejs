import {Router} from "express";

import {getAllTasksForUser, getTaskWithId,
     createTask, updateTask} from "../Controllers/task.controller.js";
import {verifyToken} from "../Utillis/userToken.js";

export const router = Router();

router.route("/")
    .get(verifyToken, getAllTasksForUser)
    .post(verifyToken, createTask);
    
router.route("/:id")
    .get(verifyToken, getTaskWithId)
    .put(verifyToken, updateTask)
    .delete(verifyToken, updateTask);
