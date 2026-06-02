const now = () => Date.now() - start;
const start = Date.now();

const throttle = function(fn, t) {
    let timeoutInProgress = null
    let argsToProcess = null

    const timeoutFunction = () => {
        if(argsToProcess === null) {
            timeoutInProgress = null
        } else {
            fn(...argsToProcess)
            argsToProcess = null
            timeoutInProgress = setTimeout(timeoutFunction, t);
        }
    }

    return function(...args) {
        if(timeoutInProgress) {
            argsToProcess = args
        } else {
            fn(...args)
            timeoutInProgress = setTimeout(timeoutFunction, t)
        }
    }
};

function log(value) {
    console.log(`✅ log(${value}) executed at ${now()}ms\n`);
}

const throttled = throttle(log, 1000);
setTimeout(() => throttled(4), 200); // 1 
setTimeout(() => throttled(5), 600); // 2
setTimeout(() => throttled(6), 800); // 3
setTimeout(() => throttled(7), 1200); // 4
setTimeout(() => throttled(8), 2100); // 5
setTimeout(() => throttled(9), 3200); // 6

// 4 - 200 (200+1000) => 1200
// 7 - 1200 (1200+1000) => 2200
// 8 - 2200 (2200+1000) => 3200
// 9 - 3200 (3200+1000) => 4200

