import { EvictionAlgorithm } from "./EvictionAlgorithm";
import { DoublyLinkedList, DoublyLinkedListNode } from '@datastructures-js/linked-list';
import { MutexLock } from "../Utils/MutexLock";

export class LRUEviction implements EvictionAlgorithm {
    private keyToNodeMap;
    private dll;
    private lock: MutexLock;
    
    constructor() {
        this.dll = new DoublyLinkedList();
        this.keyToNodeMap = new Map();
        this.lock = new MutexLock();
    }
    
    async keyAccessed(key: any) {
        await this.lock.runExclusive(async () => {
            if (this.keyToNodeMap.has(key)) {
                const node = this.keyToNodeMap.get(key);
                this.dll.remove(node);
            } else {
                const newNode = new DoublyLinkedListNode(key);
                this.keyToNodeMap.set(key, newNode);
            }
            this.dll.insertLast(this.keyToNodeMap.get(key));
        });
    }
    
    
    async evictKey() {
        return this.lock.runExclusive(async () => {
            const head = this.dll.head();
            if (!head) {
                return null;
            }
            const key = head.getValue();
            this.keyToNodeMap.delete(key);
            this.dll.removeFirst();
            return key;
        });
    }
}
