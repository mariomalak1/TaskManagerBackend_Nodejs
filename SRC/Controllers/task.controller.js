import {TaskModel} from "../../DB/Models/task.model.js";
import {getAll_Response} from "../Utillis/defaultResponses.js";
import {paginate} from "../Utillis/paginationForModel.js";

export const getAllTasksForUser = async (req, res) => {
    const whereClue = {
        UserId: req.user.id 
    }
    const tasks = paginate(req, res, TaskModel, whereClue);
    return res.status(200).json({data});
}