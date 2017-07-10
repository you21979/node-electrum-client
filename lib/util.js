'use strict'

const makeRequest = exports.makeRequest = (method, params, id) => {
    return JSON.stringify({
        jsonrpc : "2.0",
        method : method,
        params : params,
        id : id,
    })
}

const recursiveParser = exports.recursiveParser = (n, buffer, callback) => {
    const MAX_DEPTH = 20;
    if(buffer.length === 0) {
        return {code:0, buffer:buffer}
    }
    if(n > MAX_DEPTH) {
        return {code:1, buffer:buffer}
    }
    const xs = buffer.split('\n')
    if(xs.length === 1){
        return {code:0, buffer:buffer}
    }
    const content = xs.shift()

    callback(content, n)
    return recursiveParser(n + 1, xs.join('\n'), callback)
}

const createPromiseResult = exports.createPromiseResult = (resolve, reject) => {
    return (err, result) => {
        if(err) reject(err)
        else resolve(result)
    }
}

class MessageParser{
    constructor(callback){
        this.buffer = ''
        this.callback = callback
    }
    run(chunk){
        this.buffer += chunk
        while(true){
            const res = recursiveParser(0, this.buffer, this.callback)
            this.buffer = res.buffer
            if(res.code === 0){
                break;
            }
        }
    }
}
exports.MessageParser = MessageParser

