import { ApiError } from "../Utillis/apiErrors.js";

// express error handdler
const globalErrorHandle = (err, req, res, next) => {
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
        res.status(400).send({
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