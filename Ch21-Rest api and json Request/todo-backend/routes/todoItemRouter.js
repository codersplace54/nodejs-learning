const express = require("express");
const todoItemRouter = express.Router();

const todoItemController = require("../controllers/todoItemController");

todoItemRouter.get("/", todoItemController.getTodoItems);
todoItemRouter.post("/", todoItemController.createTodoItem);
todoItemRouter.delete("/:id",todoItemController.deleteTodoItem);
todoItemRouter.put("/:id/completed",todoItemController.markCompleted);

module.exports = todoItemRouter;