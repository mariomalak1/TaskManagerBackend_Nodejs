import {Router} from "express";

import {getAllTasksForUser, getTaskWithId,
     createTask} from "../Controllers/task.controller.js";
import {verifyToken} from "../Utillis/userToken.js";

export const router = Router();

router.route("/")
    .get(verifyToken, getAllTasksForUser)
    .post(verifyToken, createTask);
    
router.route("/:id").get(verifyToken, getTaskWithId);
