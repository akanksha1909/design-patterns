function delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms)
    })
}


export class Counter {
    private value: number;
    constructor() {
        this.value = 0;
    }

    async increment() {
        const currenVal = this.value;
        await delay(100)
        this.value = currenVal + 1;
    }

    public getValue(): number {
        return this.value;
    }
}