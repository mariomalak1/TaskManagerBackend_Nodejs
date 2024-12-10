import dotenv from "dotenv";
import Express from 'express';

import {dbConnection, sequelize} from "./DB/db_connection.js"
import {router as apiRouter} from "./SRC/Routers/index.router.js";
import {ApiError} from "./SRC/Utillis/apiErrors.js";
import globalErrorHandle from "./SRC/Middlewares/globalErrorHandle.middleware.js";
import cors from 'cors';


dotenv.config({path: "config.env"});

const app = Express();

const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow all origins
      callback(null, true);
    },
    credentials: true, // Allow credentials
  };
  
  app.use(cors(corsOptions));
  
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
