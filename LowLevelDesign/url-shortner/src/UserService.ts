import { randomUUID as uuid } from 'node:crypto';
import { User } from "./User";

export class UserService {
    private static instance: UserService;
    private users: Map<string, User>

    private constructor() {
        this.users = new Map();
    }

    public static getInstance(): UserService {
        if(!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance
    }

    public createUser(name: string): User {
        const userId = uuid();
        const user = new User(userId, name);
        this.users.set(userId, user);
        return user;
    }

    public getUser(id: string) {
        return this.users.get(id);
    }
}