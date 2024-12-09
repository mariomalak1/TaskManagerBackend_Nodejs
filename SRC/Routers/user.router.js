import {Router} from "express";

import {getAllUsers} from "../Controllers/user.controller.js";

export const router = Router();

router.route("/").get(getAllUsers);
