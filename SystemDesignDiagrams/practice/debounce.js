function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}

const log = debounce(() => console.log("Typing Stopped!"), 500)
log();
log();
log();
