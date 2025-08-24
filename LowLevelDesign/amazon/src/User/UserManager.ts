import { User } from "./User";

export class UserManager {
    public users: Map<string, User>;
    private static instance: UserManager;

    private constructor() {
        this.users = new Map();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    addUser(id: string, name: string, email: string): User {
        const user = new User(id, name, email);
        this.users.set(id, user);
        return user;
    }

    getUser(id: string): User | undefined {
        return this.users.get(id);
    }
}