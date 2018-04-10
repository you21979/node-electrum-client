// http://www.jsonrpc.org/specification

export interface IRequest{
    jsonrpc: '2.0'
    method: string
    params: Object | Array<any>
    id: number
}

export interface IResponse{
    jsonrpc: '2.0'
    result: any
    id: number
}

export interface INotification{
    jsonrpc: '2.0'
    method: string
    params?: Array<any>
}

export interface IError{
    code: number
    message: string
}

export interface IResponseError{
    jsonrpc: '2.0'
    error: IError
    id: number
}

export enum ERROR_REASON{
    USER_DEFINE,
    PARSE_ERROR,
    INVALID_REQUEST,
    METHOD_NOT_FOUND,
    INVALID_PARAMS,
    INTERNAL_ERROR,
    SERVER_ERROR,
}

export enum JSON_TYPE{
    UNKNOWN,
    BATCH,
    REQUEST,
    RESPONSE,
    NOTIFICATION,
    RESPONSE_ERROR,
}

export const autoDetect = (obj: any): JSON_TYPE => {
    if(obj instanceof Array){
        return JSON_TYPE.BATCH
    }
    if(typeof obj !== 'object'){
        return JSON_TYPE.UNKNOWN
    }
    if(obj['jsonrpc'] !== '2.0'){
        return JSON_TYPE.UNKNOWN
    }
    if(obj['result']){
        return JSON_TYPE.RESPONSE
    }
    if(typeof obj['error'] === 'object'){
        return JSON_TYPE.RESPONSE_ERROR
    }
    if(typeof obj['method'] === 'string'){
        if(typeof obj['id'] === 'number'){
            return JSON_TYPE.REQUEST
        }else{
            return JSON_TYPE.NOTIFICATION
        }
    }
    return JSON_TYPE.UNKNOWN
}

export const resolveBatch = ( obj: any ): Array<any> => {
    if(autoDetect(obj) === JSON_TYPE.BATCH){
        return obj as Array<any>
    }
    throw new Error('invalid type')
}

export const resolveRequest = ( obj: any ): IRequest => {
    if(autoDetect(obj) === JSON_TYPE.REQUEST){
        return obj as IRequest
    }
    throw new Error('invalid type')
}

export const resolveResponse = ( obj: any ): IResponse => {
    if(autoDetect(obj) === JSON_TYPE.RESPONSE){
        return obj as IResponse
    }
    throw new Error('invalid type')
}

export const resolveNotification = ( obj: any ): INotification => {
    if(autoDetect(obj) === JSON_TYPE.NOTIFICATION){
        return obj as INotification
    }
    throw new Error('invalid type')
}

export const resolveResponseError = ( obj: any ): IResponseError => {
    if(autoDetect(obj) === JSON_TYPE.RESPONSE_ERROR){
        return obj as IResponseError
    }
    throw new Error('invalid type')
}

export const makeRequest = (method: string, params: Object | Array<any>, id: number): IRequest => {
    const obj: IRequest = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: id,
    }
    return obj
}

export const makeResponse = (result: any, id: number): IResponse => {
    const obj: IResponse = {
        jsonrpc: '2.0',
        result: result,
        id : id,
    }
    return obj
}

export const makeNotification = (method: string, params?: Array<any>): INotification => {
    const obj: INotification = {
        jsonrpc: '2.0',
        method: method,
    }
    if(params) obj.params = params
    return obj
}


export const makeResponseError = (code: number, message: string, id: number): IResponseError => {
    const error: IError = {
        code: code,
        message: message,
    }
    const obj: IResponseError = {
        jsonrpc: '2.0',
        error: error,
        id : id,
    }
    return obj
}

export const detectErrorCodeType = (error_code: number): ERROR_REASON => {
    if(error_code === -32700) return ERROR_REASON.PARSE_ERROR
    else if(error_code === -32600) return ERROR_REASON.INVALID_REQUEST
    else if(error_code === -32601) return ERROR_REASON.METHOD_NOT_FOUND
    else if(error_code === -32602) return ERROR_REASON.INVALID_PARAMS
    else if(error_code === -32603) return ERROR_REASON.INTERNAL_ERROR
    else if(error_code <= -32000 && error_code >= -32099) return ERROR_REASON.SERVER_ERROR
    return ERROR_REASON.USER_DEFINE
}

