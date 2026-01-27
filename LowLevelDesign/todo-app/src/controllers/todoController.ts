import { Request, Response } from 'express';
import { todoService } from "../services/todoService";

class ToDoController {

    async createTodo(req: Request, res: Response) {
        try {
            const todo = await todoService.createTodo(req.body);
            return res.status(201).json({ message: "Created Successfully", data: todo })
        } catch (error) {
            console.error('Error creating todo:', error);
            return res.status(500).json({ message: "Internal server error", error: error.message })
        }
    }

    async getToDoById(req: Request, res: Response) {
        try {
            const todo = await todoService.getToDoById(req.params.todoId)
            return res.status(200).json({ data: todo })

        } catch (error) {
            console.error('Error creating todo:', error);
            return res.status(500).json({ message: "Internal server error", error: error.message })
        }
    }
}

export const todoController = new ToDoController();