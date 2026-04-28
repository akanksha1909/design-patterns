import express from 'express';
import { todoController } from '../controllers/todoController';
import { todoModel } from '../models/todoModel';
import todoSchema from '../validators/toDoValidator';

const router = express.Router();


function validator(schema) {
    return (req, res, next) => {
        schema.validate(req.body.data)
            .then(() => next())
            .catch((err) => next(err));
    }
}

router.get("/:todoId", (req, res) => todoController.getToDoById(req, res));

router.post("/", validator(todoSchema), todoController.createTodo);

export default router;