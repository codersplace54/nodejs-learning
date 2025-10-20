const TodoItem = require("../models/TodoItem");
const todoItem = require("../models/TodoItem");

exports.createTodoItem = async (req, res, next) => {
    console.log(req.body);

    const { title, date } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'title is required' });
    }
    const todoItem = new TodoItem({ title, date });
    await todoItem.save();
    res.status(201).json(todoItem);
}

exports.getTodoItems = async (req, res, next) => {
    const todoItems = await TodoItem.find();
    res.json(todoItems);
}

exports.deleteTodoItem = async (req, res, next) => {
    const { id } = req.params;
    await TodoItem.findByIdAndDelete(id);
    res.status(204).json({ _id: id });
}

exports.markCompleted = async (req, res, next) => {
    const { id } = req.params;
    const todoItem = await TodoItem.fincById(id);
    todoItem.completed = true;
    await todoItem.save();
    res.json(todoItem);
}

