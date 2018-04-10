import {Socket} from 'net'
import {EventEmitter} from 'events'
import {initSocket, connectSocket, ISocketEvent} from './socket_helper'
import {JsonMessageParser} from './json_message_parser'
import * as rpctype from './jsonrpc_type'

type async_callback = (e: null | Error, message?: any) => void

const createPromiseResult = (resolve: (any) => void, reject: (Error) => void): async_callback => {
    return (err, result) => {
        if(err) reject(err)
        else resolve(result)
    }
}

export class Client implements ISocketEvent{
    private seq: number
    private port: number
    private host: string
    private callback_message_table: { [key: string]: async_callback }
    private conn: Socket
    private jmp: JsonMessageParser
    private status: number
    public subscribe: EventEmitter
    
    constructor(port: number, host: string, protocol: string = 'tcp', options: any = void 0){
        this.seq = 0
        this.port = port
        this.host = host
        this.callback_message_table = {}
        this.subscribe = new EventEmitter()
        this.conn = initSocket(this, protocol, options)
        this.jmp = new JsonMessageParser((obj: any): void => {
            const type = rpctype.autoDetect(obj)
            switch(type){
            case rpctype.JSON_TYPE.BATCH:
                break // don't support batch request
            case rpctype.JSON_TYPE.RESPONSE:
                this.onMessageResponse(rpctype.JSON_TYPE.RESPONSE, rpctype.resolveResponse(obj))
                break
            case rpctype.JSON_TYPE.RESPONSE_ERROR:
                this.onMessageResponse(rpctype.JSON_TYPE.RESPONSE_ERROR, rpctype.resolveResponseError(obj))
                break
            case rpctype.JSON_TYPE.NOTIFICATION:
                this.onMessageNotification(rpctype.resolveNotification(obj))
                break
            default:
                break;
            }
        })
        this.status = 0
    }

    connect(): Promise<void>{
        if(this.status) {
            return Promise.resolve()
        }
        this.status = 1
        return connectSocket(this.conn, this.port, this.host)
    }

    close(): void{
        if(!this.status) {
            return
        }
        this.conn.end()
        this.conn.destroy()
        this.status = 0
    }

    request(method: string, params: any): Promise<rpctype.IResponse>{
        if(!this.status) {
            return Promise.reject(new Error('ESOCKET'))
        }
        return new Promise((resolve, reject) => {
            const id: number = ++this.seq
            const req: rpctype.IRequest = rpctype.makeRequest(method, params, id)
            const content: string = [JSON.stringify(req), '\n'].join('')
            this.callback_message_table[id] = createPromiseResult(resolve, reject)
            this.conn.write(content)
        })
    }

    response(type: rpctype.JSON_TYPE, message: rpctype.IResponse | rpctype.IResponseError){
        const cb: async_callback = this.callback_message_table[message.id]
        if(cb){
            delete this.callback_message_table[message.id]
            switch(type){
            case rpctype.JSON_TYPE.RESPONSE:
                const r: rpctype.IResponse = message as rpctype.IResponse
                cb(null, r.result)
                break
            case rpctype.JSON_TYPE.RESPONSE_ERROR:
                const re: rpctype.IResponseError = message as rpctype.IResponseError
                cb(new Error(re.error.code + ': ' + re.error.message))
                break
            }
        }else{
            ; // can't get async_callback
        }
    }

    private onMessageResponse(type: rpctype.JSON_TYPE, message: rpctype.IResponse | rpctype.IResponseError){
        this.response(type, message)
    }

    private onMessageNotification(message: rpctype.INotification){
        this.subscribe.emit(message.method, message.params)
    }

    onConnect(): void{
    }

    onClose(): void{
        Object.keys(this.callback_message_table).forEach((key) => {
            this.callback_message_table[key](new Error('close connect'))
            delete this.callback_message_table[key]
        })
    }

    onRecv(chunk: string): void{
        try{
            this.jmp.run(chunk)
        }catch(e){
            // close
        }
    }

    onEnd(e: Error): void{
    }

    onError(e: Error): void{
    }

}

