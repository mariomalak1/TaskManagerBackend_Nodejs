import {Router} from "express";
import {router as userRouter} from "./user.router.js";
import {router as taskRouter} from "./task.router.js";

export const router = Router();

router.use("/users", userRouter);
router.use("/tasks", taskRouter)