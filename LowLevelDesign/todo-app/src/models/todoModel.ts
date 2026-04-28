import db from '../database/connection';

class ToDoModel {
    async insert(title, description) {
        return db('todos_table').insert({ title, description }).returning("*")
    }

    async find(todoId) {
        return db('todos_table').where({ id: todoId });
    }

    async findAll() {
        return db('todos_table').select("*").orderBy('created_at', 'desc');
    }

    async delete(todoId) {
        return db('todos_table').where({ id: todoId }).del();
    }
}

export const todoModel = new ToDoModel()