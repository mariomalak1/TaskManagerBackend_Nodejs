import { Op } from "sequelize";

import { TaskModel } from "../../DB/Models/task.model.js";
import { responseObjWithPaginator } from "../Utillis/defaultResponses.js";
import { paginate } from "../Utillis/paginationForModel.js";
import { ApiError } from "../Utillis/apiErrors.js";
import { nanoid } from "nanoid";

export const getAllTasksForUser = async (req, res) => {
  // where clue that will put it in model
  const whereClue = {
    UserId: req.user.id,
  };

  const tasks = await TaskModel.findAll({
    where: whereClue,
    attributes: ["id", "title", "status", "completeTime", "createdAt"],
  });

  return res.status(200).json({
    numOfTasks: tasks.length,
    data: tasks,
  });
};

// @params  id -required
export const getTaskWithId = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError("must provide task id", 400));
  }

  const task = await TaskModel.findByPk(id);

  if (!task) {
    return res.sendStatus(404);
  }

  return res.status(200).json({ data: task });
};

export const createTask = async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "must provide title" });
  }
  const id = nanoid(8);

  const task = await TaskModel.create({ id, title, UserId: req.user.id });

  return res.status(200).json({
    data: task,
  });
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;

  let task = await TaskModel.findByPk(id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.status !== null) {
    if (req.status > 1 || req.status < 0) {
      return res.status(400).json({ error: "status must be 0 or 1" });
    }

    task.status = req.body.status;

    if (req.body.status == 0) {
      task.completeTime = null;
    }

    // change complete time
    if (req.body.status == 1) {
      task.completeTime = new Date();
    }
  }

  task.title = req.body.title || task.title;

  task.save();

  return res.status(200).json({ data: task });
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError("must provide task id", 400));
  }

  const task = await TaskModel.findByPk(id);

  if (!task) {
    return res.sendStatus(404);
  }

  await task.destroy();

  res.status(200).json({ message: "Task deleted successfully" });
};

export const numberOfComUnComTasks = async (req, res, next) => {
  const numOfUnCompletedTasks = await TaskModel.findAll({
    where: {
      status: 0,
    },
  });

  const numOfCompletedTasks = await TaskModel.findAll({
    where: {
      status: 1,
    },
  });

  return res
    .status(200)
    .json({
      data: {
        numOfCompletedTasks: numOfCompletedTasks.length,
        numOfUnCompletedTasks: numOfUnCompletedTasks.length,
      },
    });
};

export const numberOfTasksCompeletedPerDayInMonth = async (req, res, next) => {
  const { month } = req.query;

  // Validate month input
  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Must provide a valid month (1-12)" });
  }

  const currentYear = new Date().getFullYear();
  const requestedMonth = parseInt(month) - 1; // Convert to 0-indexed month

  // Define date range for the query
  const startOfMonth = new Date(currentYear, requestedMonth, 1);
  const endOfMonth = new Date(currentYear, requestedMonth + 1, 1); 
  console.log(startOfMonth, endOfMonth);

  try {
    // Fetch completed tasks within the specified range
    const tasks = await TaskModel.findAll({
      where: {
        status: 1, // Completed tasks
        completeTime: {
          [Op.gte]: startOfMonth,
          [Op.lt]: endOfMonth,
        },
      },
    });

    // Determine number of days in the month
    const daysInMonth = new Date(currentYear, requestedMonth + 1, 0).getDate();

    // Aggregate tasks per day
    const tasksPerDay = Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const taskCount = tasks.filter(
        (task) => task.completeTime.getDate() === day
      ).length;
      return { day, taskCount };
    });

    return res.status(200).json({ data: { tasksPerDay } });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

