import {Router} from "express";

import {getAllUsers, createNewUser, login, getUserWithId} from "../Controllers/user.controller.js";

export const router = Router();

// authentication
router.route("/authenticate")
        .post(createNewUser)
        .post(login);


router.route("/")
        .get(getAllUsers);

router.route("/:id")
        .get(getUserWithId);