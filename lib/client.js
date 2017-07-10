'use strict'
const EventEmitter = require('events').EventEmitter;
const tls = require('tls');
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

const getSocket = (protocol, options) => {
    switch(protocol){
    case 'tcp':
        return new net.Socket();
    case 'tls':
    case 'ssl':
        return new tls.TLSSocket(options);
    }
    throw new Error('unknown protocol')
}

const initSocket = (self, protocol, options) => {
    const conn = getSocket(protocol, options);
    conn.setEncoding('utf8')
    conn.setKeepAlive(true, 0)
    conn.setNoDelay(true)
    conn.on('connect', () => {
        self.onConnect()
    })
    conn.on('close', () => {
        self.onClose()
    })
    conn.on('data', (chunk) => {
        self.onRecv(chunk)
    })
    conn.on('end', () => {
        self.onEnd()
    })
    return conn
}

class Client{
    constructor(port, host, protocol = 'tcp', options = void 0){
        this.id = 0;
        this.port = port
        this.host = host
        this.callback_message_queue = {}
        this.subscribe = new EventEmitter()
        this.conn = initSocket(this, protocol, options)
        this.mp = new MessageParser((body, n) => {
            this.onMessage(body, n)
        });
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

    request(method, params){
        return new Promise((resolve, reject) => {
            const id = ++this.id;
            const content = util.makeRequest(method, params, id);
            this.callback_message_queue[id] = util.createPromiseResult(resolve, reject);
            this.conn.write(content + '\n');
        })
    }

    response(msg){
        const callback = this.callback_message_queue[msg.id]
        if(callback){
            delete this.callback_message_queue[msg.id]
            if(msg.error){
                callback(msg.error)
            }else{
                callback(null, msg.result)
            }
        }
    }

    onConnect(){
    }

    onClose(){
        Object.keys(this.callback_message_queue).forEach((key) => {
            this.callback_message_queue[key](new Error('close connect'))
            delete this.callback_message_queue[key]
        })
    }

    onRecv(chunk){
        this.mp.run(chunk)
    }

    onEnd(){
    }

    onMessage(body, n){
        const msg = JSON.parse(body)
        if(msg instanceof Array){
            ; // don't support batch request
        } else {
            if(msg.id !== void 0){
                this.response(msg)
            }else{
                this.subscribe.emit(msg.method, msg.params)
            }
        }
    }
}

module.exports = Client
