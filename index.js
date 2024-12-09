import dotenv from "dotenv";
import Express from 'express';

import {dbConnection, sequelize} from "./DB/db_connection.js"
import {router as apiRouter} from "./SRC/Routers/index.router.js";
import {ApiError} from "./SRC/Utillis/apiErrors.js";
import globalErrorHandle from "./SRC/Middlewares/globalErrorHandle.middleware.js";


dotenv.config({path: "config.env"});

const app = Express();

app.use(Express.json());

const PORT = process.env.PORT || 3000;

dbConnection();

// sequelize.sync({"force":true});

app.use("/api/v1", apiRouter);

// handle invalid routers
app.use("*", (req, res, next) => {
    next(new ApiError("invalid route", 404));
});

// express error handler
app.use(globalErrorHandle);


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// handle errors outside express
process.on("unhandledRejection", (err) => {
    console.error(`${err.name} | ${err.message}`);

    // close the program after finish all requests
    server.close(() => {
        process.exit(0);
    });
});
