// @desc    class to handdle operational error of API
export class ApiError extends Error{
    constructor (message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? "fail" : "error";
        this.isOperational = true;
    }
}
