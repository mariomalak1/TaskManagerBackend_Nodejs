import {Router} from "express";

import {getAllUsers, createNewUser, login, getUserWithId} from "../Controllers/user.controller.js";

export const router = Router();

// authentication
router.post("/login/", login);
router.post("/register/", createNewUser);


router.route("/")
        .get(getAllUsers);

router.route("/:id")
        .get(getUserWithId);