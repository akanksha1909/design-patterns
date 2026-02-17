import { EvictionAlgorithm } from "./EvictionAlgorithm";
import { DoublyLinkedList, DoublyLinkedListNode } from '@datastructures-js/linked-list';

export class LRUEviction implements EvictionAlgorithm {
    private keyToNodeMap;
    private dll;

    constructor() {
        this.dll = new DoublyLinkedList();
        this.keyToNodeMap = new Map();
    }

    keyAccessed(key: any) {
        if (this.keyToNodeMap.has(key)) {
            const node = this.keyToNodeMap.get(key);
            this.dll.remove(node);
        } else {
            const newNode = new DoublyLinkedListNode();
            this.keyToNodeMap.set(key, newNode);
        }
        this.dll.insertLast(this.keyToNodeMap.get(key));
    }


    evictKey() {
        const head = this.dll.head();
        this.keyToNodeMap.delete(head.getValue());
        this.dll.removeFirst();
    }
}