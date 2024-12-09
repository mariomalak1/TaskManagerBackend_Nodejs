import {TaskModel} from "../../DB/Models/task.model.js";
import {getAll_Response} from "../Utillis/defaultResponses.js";


export const getAllTasks = async (req, res) => {
    return await getAll_Response(req, res, TaskModel, false, true);
}