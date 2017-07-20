'use strict'
const tls = require('tls');
const net = require('net');

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
    conn.on('close', (e) => {
        self.onClose(e)
    })
    conn.on('data', (chunk) => {
        self.onRecv(chunk)
    })
    conn.on('end', (e) => {
        self.onEnd(e)
    })
    conn.on('error', (e) => {
        self.onError(e)
    })
    return conn
}

module.exports = initSocket
