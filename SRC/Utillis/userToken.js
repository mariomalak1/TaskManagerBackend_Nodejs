
import jwt from "jsonwebtoken";
import { UserModel } from "../../DB/Models/user.model.js";
export const generateUserToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
};

export const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  // send 401 status - unauthorized
  if (!token) return res.sendStatus(401);

  // verfiy change in payload or if token expired
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  // check if the user exists
  const user = await UserModel.findOne({ where: { email: decoded.email } });

  // if user doesnt exsits return 403 - forbidden
  if (!user) {
    return res.status(403).json({ error: "Please login and try again." });
  }


  // set user in req
  req.user = user;
  next();
};
