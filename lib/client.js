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

class Client{
    constructor(port, host, protocol = 'tcp', options = void 0){
        this.port = port
        this.host = host
        this.hostname = [host, port].join(':')
        this.callback_message_queue = {}
        this.id = 0;

        this.mp = new MessageParser((body, n) => {
            this.onMessageRecv(JSON.parse(body));
        });
        this.subscribe = new EventEmitter()
        const conn = this.conn = getSocket(protocol, options);
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
            const list = [
                'server.peers.subscribe',
                'blockchain.numblocks.subscribe',
                'blockchain.headers.subscribe',
                'blockchain.address.subscribe'
            ]
            list.forEach(event => this.subscribe.removeAllListeners(event))
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
