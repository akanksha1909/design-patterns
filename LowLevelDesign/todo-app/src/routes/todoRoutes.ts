import express from 'express';
import { todoController } from '../controllers/todoController';

const router = express.Router();

router.get("/:todoId", (req, res) => todoController.getToDoById(req, res));

router.post("/", (req, res) => todoController.createTodo(req, res));

export default router;