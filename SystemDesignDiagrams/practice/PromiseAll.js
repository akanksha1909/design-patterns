function PromiseAll(functions) {
    let results = new Array(functions.length)
    let resolvedCount = 0
    return new Promise((resolve, reject) => {
        functions.forEach((fn, i) => {
            fn().then((result) => {
                results[i] = result
                resolvedCount += 1
                if(resolvedCount == functions.length) {
                    return resolve(results)
                }
            }).catch(error => {
                return reject(error)
            })
        })
    })
}

PromiseAll([() => new Promise(res => res(42)), () => new Promise(res => res(50))]).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })