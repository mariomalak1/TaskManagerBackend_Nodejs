import { UserModel } from "../../DB/Models/user.model.js";

import { hashPassword, verifyPassword } from "../Utillis/hashPassword.js";
import { getAll_Response } from "../Utillis/defaultResponses.js";
import { generateUserToken } from "../Utillis/userToken.js";
import { nanoid } from "nanoid";
import jwt  from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  return await getAll_Response(req, res, UserModel, false, true);
};

export const getUserWithId = async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(400).json({ error: "Please login first." });
  }

  const payload = jwt.verify(token, process.env.SECRET_KEY);

  const {id} = payload;

  const user = await UserModel.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    data: user,
  });
};

export const createNewUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "missed some required data" });
  }

  const users = await UserModel.findAll({
    where: {
      email: email,
    },
  });

  if (users.length > 0) {
    return res
      .status(400)
      .json({ error: "There's already an account with this email" });
  }

  // hash passsword
  const hashedPassword = await hashPassword(password);
  const id = nanoid(7);
  console.log(id);
  await UserModel.create({ id, name, email, password: hashedPassword });

  return res.status(200).json({
    message: "user created successfully",
    userName: name,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({ error: "missed some required data" });
  }

  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  } else {
    // verfiy passsword

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    } else {
      const token = generateUserToken(email, user.id);
      return res
        .status(200)
        .json({ data: "user login successfully", token, userName: user.name });
    }
  }
};
