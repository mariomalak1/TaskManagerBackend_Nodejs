import {Router} from "express";

import {getAllTasksForUser} from "../Controllers/task.controller.js";
import {verifyToken} from "../Utillis/userToken.js";

export const router = Router();

router.route("/").get(verifyToken, getAllTasksForUser);
