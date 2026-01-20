import { Observer, TripEventType } from './Observer';
import { Trip } from '../models/Trip';

/**
 * Subject interface - defines methods for managing observers
 */
export class Subject {
    protected observers: Observer[];

    constructor() {
        this.observers = [];
    }

    /**
     * Attach an observer to this subject
     * @param observer - The observer to attach
     */
    attach(observer: Observer): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    /**
     * Detach an observer from this subject
     * @param observer - The observer to detach
     */
    detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Notify all observers of a change
     * @param data - Data to pass to observers
     * @param eventType - Type of event
     */
    notify(data: Trip, eventType: TripEventType): void {
        this.observers.forEach(observer => {
            observer.update(data, eventType);
        });
    }
}

