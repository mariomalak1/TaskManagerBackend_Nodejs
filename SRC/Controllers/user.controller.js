import {UserModel} from "../../DB/Models/user.model.js";

import {hashPassword, verifyPassword} from "../Utillis/hashPassword.js";
import {getAll_Response} from "../Utillis/defaultResponses.js";


export const getAllUsers = async (req, res) => {
    return await getAll_Response(req, res, UserModel, false, true);
}

export const getUserWithId = async (req, res, next) => {
    const {id} = req.params;

    if(!id){
        return res.status(400).json({"error": "must provide customer id"});
    }

    const user = await UserModel.findByPk(id);

    if(!user){
        return res.status(404).send();
    }    

    return res.status(200).json({
        data: user
    });
}

export const createNewUser = async (req, res, next) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({"error": "missed some required data"});
    }

    const users = await UserModel.findAll({
        where:{
            "email": email,
        }}
    );
    
    if(users.length > 0){
        return res.status(400).json({"error": "this email is used before"});
    }

    // hash passsword
    const hashedPassword = await hashPassword(password);
    
    await UserModel.create({name, email, password: hashedPassword});

    return res.status(200).json({
        data: "user register done"
    });
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!password || !email){
        return res.status(400).json({"error": "missed some required data"});
    }

    const user = await UserModel.findOne({
        where:{
            "email": email,
        }}
    );

    if(!user){
        return res.status(400).json({"error": "no email for this user"});
    }

    else{
        // verfiy passsword

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({"error": "not valid password"});   
        }
        else{
            return res.status(200).json({"data": "user login successfully"});
        }
    }
} 