import {Router} from "express";

import {getAllTasks} from "../Controllers/task.controller.js";

export const router = Router();

router.route("/").get(getAllTasks);
