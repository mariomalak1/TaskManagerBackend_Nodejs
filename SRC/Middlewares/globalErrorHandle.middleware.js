import { ApiError } from "../Utillis/apiErrors.js";

// express error handdler
const globalErrorHandle = (err, req, res, next) => {
    let status;
    // if this error generated from jwt, it means that it's token error, the user will get 401 - unauthorized 
    err.message.startsWith("jwt")? status = 401: status = 400;
    
    if((err instanceof ApiError)){
        let errorJson = {
            status: err.status,
            message: err.message,
        }
        
        if(process.env.ENV_MODE === "development"){
            errorJson.stack = err.stack;
            errorJson.error = err;
        }
        res.status(err.statusCode).send({error:{...errorJson}});
    }
    else{
        res.status(status).send({
            error: {
                status: "error",
                message: err.message,
                error: err,
                stack: err.stack,
            }
        })
    }
};

export default globalErrorHandle;