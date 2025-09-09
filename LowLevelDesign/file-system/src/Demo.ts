import { Shell } from "./Shell";

class Demo {
    constructor() {
        console.log("File System Design Pattern Demo");
    }

    run() {
        const shell = new Shell();
        const commands = [
            "pwd",
            "mkdir /home",
            "mkdir /home/user"
        ]

        for (const command of commands) {
            shell.executeCommand(command);
        }
    }
}

new Demo().run()