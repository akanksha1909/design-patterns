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
            "mkdir /home/user",
            "cd /home",
            "ls",
            "touch test.txt",
            "echo 'Hello, World!' > test.txt",
            "cat test.txt",
            "ls -l",
            "cd ..",
            "ls -l"

        ]

        for (const command of commands) {
            shell.executeCommand(command);
        }
    }
}

new Demo().run()