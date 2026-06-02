import { Shell } from './Shell.js';

class Demo {

    run() {
        const shell = new Shell();
        const commands = [
            "pwd",
            "mkdir /home",
            "mkdir /home/user",
            "cd /home",
            "ls",
            "pwd",
            "mkdir test",
            "cd test",
            "pwd",
            "cd ../..",
            "ls",
            "touch test.txt",
            "ls -l"
        ]

        for (const command of commands) {
            shell.executeCommand(command);
        }
    }
}

new Demo().run()