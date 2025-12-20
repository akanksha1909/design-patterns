package com.learnings.javathreads;

import java.util.Random;

class MessageRepository {
    private String message;
    private Boolean hasMessage = false; // False: producer to send message, True means: Consumer to consume

    public synchronized String read() {
        while(!hasMessage) {
            try {
                wait();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        hasMessage = false;
        notifyAll();
        return message;
    }

    public synchronized void write(String message) {
        while(hasMessage) {
            try {
                wait();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        hasMessage = true;
        notifyAll();
        this.message = message;
    }
}

class MessageWriter implements Runnable {

    private MessageRepository outgoingMessage;
    private final String text = """
            Humpty Dumpty sat on a wall,
            Humpty Dumpty has a great fall,
            All the king's horses and all the Kings men,
            Couldn't put Humpty together again.
            """;

    public MessageWriter(MessageRepository outgoingMessage) {
        this.outgoingMessage = outgoingMessage;
    }

    public void run() {
        Random random = new Random();
        String[] lines = text.split("\n");

        for(int i=0; i<lines.length; i++) {
            outgoingMessage.write(lines[i]);
            try {
                Thread.sleep(random.nextInt(500, 2000));
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        outgoingMessage.write("Finished");
    }
}


class MessageReader implements Runnable {

    private MessageRepository incomingMessage;
    public MessageReader(MessageRepository incomingMessage) {
        this.incomingMessage = incomingMessage;
    }

    public void run() {
        Random random = new Random();
        String latestMessage = "";

        do {
            try {
                Thread.sleep(random.nextInt(500, 2000));
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            latestMessage = incomingMessage.read();
            System.out.println(latestMessage);
        } while(!latestMessage.equals("Finished"));
    }
}

public class ProducerConsumer {
    public void execute() {
        MessageRepository messageRepository = new MessageRepository();

        Thread reader = new Thread(new MessageReader(messageRepository));
        Thread writer = new Thread(new MessageWriter(messageRepository));

        reader.start();
        writer.start();
    }
}
