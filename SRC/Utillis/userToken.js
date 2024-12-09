import {dotenv} from "dotenv";
import {jwt} from 


function generateUserToken(email) {
    return jwt.sign(email, process.env.SECRET_KEY, { expiresIn: '1hr' });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    // send 401 status - unauthorized
    if (!token)
        return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {  
      if (err)
        return res.sendStatus(403);
  
      req.user = user
  
      next()
    })
}