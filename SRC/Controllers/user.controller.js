import {UserModel} from "../../DB/Models/user.model.js";
import {getAll_Response} from "../Utillis/defaultResponses.js";


export const getAllUsers = async (req, res) => {
    return await getAll_Response(req, res, UserModel, false, true);
}