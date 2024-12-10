import {TaskModel} from "../../DB/Models/task.model.js";
import {responseObjWithPaginator} from "../Utillis/defaultResponses.js";
import {paginate} from "../Utillis/paginationForModel.js";

export const getAllTasksForUser = async (req, res) => {
    // where clue that will put it in model     
    const whereClue = {
        UserId: req.user.id
    }
    
    const tasks = await paginate(req, TaskModel, whereClue);
    const response = responseObjWithPaginator(tasks);

    return res.status(200).json(response);
}