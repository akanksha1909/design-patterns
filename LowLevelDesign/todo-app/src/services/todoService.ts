import { todoModel } from '../models/todoModel';
import todoSchema from '../validators/toDoValidator';

export class ToDoService {
    async createTodo(data: { title: string; description?: string }) {
        await todoSchema.validate(data);
        const { title, description } = data;
        const [todo] = await todoModel.insert(title, description);
        return todo;
    }

    async getToDoById(todoId) {
        const todo = await todoModel.find(todoId);
        return todo;
    }

    async getAllToDos() {
        return await todoModel.findAll();
    }

    async deleteTodo(todoId) {
        return todoModel.delete(todoId);
    }
}

export const todoService = new ToDoService();