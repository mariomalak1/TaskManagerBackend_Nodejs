import {Router} from "express";

import {getAllUsers, createNewUser, login, getUserWithId} from "../Controllers/user.controller.js";
import {verifyToken} from "../Utillis/userToken.js";

export const router = Router();

// authentication
router.post("/login/", login);
router.post("/register/", createNewUser);


router.route("/")
        .get(verifyToken, getAllUsers);

router.route("/:id")
        .get(getUserWithId);