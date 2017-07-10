'use strict'
const EventEmitter = require('events').EventEmitter;
const net = require('net');
const util = require('./util');

class MessageParser{
    constructor(callback){
        this.buffer = ''
        this.callback = callback
    }
    run(chunk){
        this.buffer += chunk
        while(true){
            const res = util.recursiveParser(0, this.buffer, this.callback)
            this.buffer = res.buffer
            if(res.code === 0){
                break;
            }
        }
    }
}

class Client{
    constructor(port, host){
        this.port = port
        this.host = host
        this.hostname = [host, port].join(':')
        this.callback_message_queue = {}
        this.id = 0;

        this.mp = new MessageParser((body, n) => {
            this.onMessageRecv(JSON.parse(body));
        });
        this.subscribe = new EventEmitter()

        const conn = this.conn = new net.Socket()
        conn.setEncoding('utf8')
        conn.setKeepAlive(true, 0)
        conn.setNoDelay(true)
        conn.on('connect', () => {
        })
        conn.on('close', () => {
            Object.keys(this.callback_message_queue).forEach((key) => {
                this.callback_message_queue[key](new Error('close connect'))
                delete this.callback_message_queue[key]
            })
        })
        conn.on('data', (chunk) => {
            this.mp.run(chunk)
        })
        conn.on('end', () => {
        })
    }

    connect(){
        return new Promise((resolve, reject) => {
            this.conn.connect(this.port, this.host, () => {
                resolve()
            })
        })
    }

    close(){
        this.conn.end();
        this.conn.destroy();
    }

    onMessageRecv(msg){
        if(msg instanceof Array){
            ; // don't support batch request
        } else {
            if(msg.id !== void 0){
                const callback = this.callback_message_queue[msg.id]
                if(callback){
                    delete this.callback_message_queue[msg.id]
                    if(msg.error){
                        callback(msg.error)
                    }else{
                        callback(null, msg.result)
                    }
                }
            }else{
                this.subscribe.emit(msg.method, msg.params)
            }
        }
    }

    request(method, params){
        return new Promise((resolve, reject) => {
            const id = ++this.id;
            const content = util.makeRequest(method, params, id);
            this.callback_message_queue[id] = util.createPromiseResult(resolve, reject);
            this.conn.write(content + '\n');
        })
    }
}

module.exports = Client
