import { Socket } from 'net'
import { TLSSocket } from 'tls'

const TIMEOUT = 10000

export class TimeoutError implements Error {
    public name = 'TimeoutError';
    errno: string
    code: string
    connect: boolean
    constructor(public message: string) {
        this.errno = ''
        this.code = ''
        this.connect = false
    }
    toString() {
        return this.name + ': ' + this.message;
    }
}

const getSocket = (protocol: string, options: any): Socket => {
    switch(protocol){
    case 'tcp':
        return new Socket();
    case 'tls':
    case 'ssl':
        return new TLSSocket(options);
    }
    throw new Error('unknown protocol')
}

export interface ISocketEvent{
    onEnd: (e: Error) => void
    onError: (e: Error) => void
    onRecv: (chunk:string) => void
    onConnect: () => void
    onClose: (e: Error) => void
}

export const initSocket = (ev: ISocketEvent, protocol: string, options: any): Socket => {
    const conn: Socket = getSocket(protocol, options);
    conn.setTimeout(TIMEOUT)
    conn.setEncoding('utf8')
    conn.setKeepAlive(true, 0)
    conn.setNoDelay(true)
    conn.on('connect', () => {
        conn.setTimeout(0)
        ev.onConnect()
    })
    conn.on('close', (e: Error) => {
        ev.onClose(e)
    })
    conn.on('timeout', () => {
        const e:TimeoutError = new TimeoutError('ETIMEDOUT')
        e.errno = 'ETIMEDOUT'
        e.code = 'ETIMEDOUT'
        e.connect = false
        conn.emit('error', e)
    })
    conn.on('data', (chunk: string) => {
        conn.setTimeout(0)
        ev.onRecv(chunk)
    })
    conn.on('end', (e) => {
        conn.setTimeout(0)
        ev.onEnd(e)
    })
    conn.on('error', (e) => {
        ev.onError(e)
    })
    return conn
}

export const connectSocket = (conn: Socket, port: number, host: string): Promise<void> => {
    return new Promise((resolve: () => void, reject: (e: Error) => void) => {
        const errorHandler = (e: Error) => reject(e)
        conn.connect(port, host, () => {
            conn.removeListener('error', errorHandler)
            resolve()
        })
        conn.on('error', errorHandler)
    })
}
