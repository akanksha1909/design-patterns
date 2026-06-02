// function deepClone(obj) {
//     if (obj === null || typeof obj !== 'object') {
//         return obj; // base case: primitive value 
//     }
//     if (Array.isArray(obj)) {
//         console.log("Array.isArray")
//         console.log(obj)
//         return obj.map(deepClone);
//     }
//     const cloned = {};
//     for (const key in obj) { 
//         if (obj.hasOwnProperty(key)) { 
//             cloned[key] = deepClone(obj[key]); 
//         } 
//     }
//     return cloned;
// }
// const original = { a: 1, b: { c: 2 } }; 
// const copy = deepClone(original); copy.b.c = 100; console.log(original.b.c); // 2 (unaffected)

// function debounce(fn, delay) {
//     let timer;
//     return function (...args) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             fn.apply(this, args)
//         }, delay)
//     }
// }

// const log = debounce(() => console.log("Typing Stopped"), 2000);
// for (let i = 0; i < 3; i++) {
//     log();
//     log();
//     log();
// }

// function s (a, b, c) {
//     return a+b+c;
// }

// console.log(s(2, 3, 4));

// function s(a) {
//     return function(b) {
//         return function(c) {
//             return a + b + c;
//         }
//     }
// }

// console.log(s(2)(3)(4));

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}

const log = debounce(() => console.log("Typing Stopped!"))
log();

function fizzBuzz(n) {
    for (let i = 1; i < n + 1; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            console.log(i, 'FizzBuzz')
        }
        else if (i % 3 == 0) {
            console.log(i, "Fizz")
        }
        else if (i % 5 == 0) {
            console.log(i, "Buzz")
        }
    }
}

fizzBuzz(20);

function greet(name = 'Guest') {
    return `Hello, ${name}!`;
}

console.log(greet("Akanksha"))

function getEvenSquares(nums) {
    const newArray = nums.filter(num => num % 2 == 0).map(num => num * num)
    console.log(newArray)
}

getEvenSquares([1, 2, 3, 4, 5, 6, 7, 8])

const user = { name: "Akanksha", age: 27, address: { city: "Lucknow", country: "India" } };

const { city, country } = user.address;
console.log(city, country)


function combine(a, b, c) {
    console.log([...a, ...b, ...c]);
}
combine([1, 2], [3, 4], [5]); // [1, 2, 3, 4, 5]

class Animal {
    constructor() {

    }

    speak() {
        console.log("Animal Speaks")
    }
}

class Dog extends Animal {
    constructor() {
        super()
    }

    speak() {
        console.log("Dog barks")
    }
}
const a = new Animal()
a.speak()

const d = new Dog();
d.speak()

function repeatAction(callback, times) {
    for (let i = 0; i < times; i++) {
        callback();
    }
}

repeatAction(() => console.log("Hi!"), 3);

async function run(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms)
    });
}

await run(2000);
console.log("Done");

const users = new Map();
users.set(1, "Akanksha");
users.set(2, "Atishay");
users.set(3, "Anshuman");
users.set(4, "Adarsh");

console.log(users.get(3))
for(const [key, value] of users) {
    console.log(key, value)
}

import { add, subtract } from './mathUtils.js';

console.log(add(3, 4));
console.log(subtract(9, 4));

const ab = []
ab.push(1);
ab.push(3);

console.log(ab)

for(const item of ab) {
    console.log(item);
}


