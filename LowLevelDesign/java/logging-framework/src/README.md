🧩 What is CopyOnWriteArrayList?

CopyOnWriteArrayList is a thread-safe variant of ArrayList in Java that belongs to the package
java.util.concurrent.

Unlike a normal ArrayList, it allows safe concurrent reads and writes without using explicit synchronization (like synchronized blocks).

⚙️ How It Works Internally

Whenever you modify the list (like add(), remove()),
it creates a new copy of the underlying array.

Read operations (like get(), forEach(), iterator()) happen on a snapshot of the array —
they don’t need locks and are very fast.

So:

Writes are expensive (because they copy the array).

Reads are very fast and thread-safe.

🔍 Example
List<String> list = new CopyOnWriteArrayList<>();

list.add("A");
list.add("B");

for (String s : list) {
System.out.println(s);
}


If another thread does list.add("C") while iteration is happening,
the iterator won’t throw ConcurrentModificationException —
because the iterator is reading from an old snapshot.