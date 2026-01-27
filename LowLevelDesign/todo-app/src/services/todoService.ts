import db from "../database/connection";

export class ToDoService {
    async createTodo(data: { title: string; description?: string }) {
        const { title, description } = data;
        const [todo] = await db('todos_table').insert({
            title,
            description
        }).returning('*');

        return todo;
    }

    async getToDoById(todoId) {
        const todo = await db('todos_table').where({ id: todoId })
        return todo;
    }

    async getAllToDos() {
        return await db('todos_table').select('*').orderBy('created_at', 'desc');
    }

    async deleteTodo(todoId) {
        return await db('todos_table').where({ id: todoId }).del()
    }
}

export const todoService = new ToDoService();