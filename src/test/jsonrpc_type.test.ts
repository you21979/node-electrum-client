import * as assert from 'assert'
import * as rpctype from '../lib/jsonrpc_type'

const fixture = {
    unknown: '100',
    request_1 : '{"jsonrpc": "2.0", "method": "add", "params": [1, 1], "id": 100}',
    response_1 : '{"jsonrpc": "2.0", "result": [], "id": 100}',
    response_error_1 : '{"jsonrpc": "2.0", "error": { "code":-1000, "message": "error" }, "id": 100}',
    notification_1 : '{"jsonrpc": "2.0", "method": "add", "params": [1, 2]}',
    notification_2 : '{"jsonrpc": "2.0", "method": "add"}',
    batch_1 : '[{"jsonrpc": "2.0", "method": "add", "params": [1, 1], "id": 100}]',
}

describe('jsonrpc_type success', () => {
    it('autodetect', () => {
        assert(rpctype.autoDetect(JSON.parse(fixture.unknown)) === rpctype.JSON_TYPE.UNKNOWN)
        assert(rpctype.autoDetect(JSON.parse(fixture.request_1)) === rpctype.JSON_TYPE.REQUEST)
        assert(rpctype.autoDetect(JSON.parse(fixture.response_1)) === rpctype.JSON_TYPE.RESPONSE)
        assert(rpctype.autoDetect(JSON.parse(fixture.response_error_1)) === rpctype.JSON_TYPE.RESPONSE_ERROR)
        assert(rpctype.autoDetect(JSON.parse(fixture.notification_1)) === rpctype.JSON_TYPE.NOTIFICATION)
        assert(rpctype.autoDetect(JSON.parse(fixture.notification_2)) === rpctype.JSON_TYPE.NOTIFICATION)
        assert(rpctype.autoDetect(JSON.parse(fixture.batch_1)) === rpctype.JSON_TYPE.BATCH)
    })
    it('resolveResponseError', () => {
        const res = rpctype.resolveResponseError(JSON.parse(fixture.response_error_1))
        assert(res.error.code === -1000)
        assert(res.error.message === 'error')
    })
    it('resolveResponse', () => {
        const res = rpctype.resolveResponse(JSON.parse(fixture.response_1))
    })
    it('resolveRequest', () => {
        const res = rpctype.resolveRequest(JSON.parse(fixture.request_1))
    })
    it('resolveNotification1', () => {
        const res = rpctype.resolveNotification(JSON.parse(fixture.notification_1))
        assert(res.method === "add")
        assert(res.params)
    })
    it('resolveNotification2', () => {
        const res = rpctype.resolveNotification(JSON.parse(fixture.notification_2))
        assert(res.method === "add")
        assert(res.params === void 0)
    })
    it('resolveBatch', () => {
        const res = rpctype.resolveBatch(JSON.parse(fixture.batch_1))
        const type_list = res.map( obj => rpctype.autoDetect(obj))
        assert(type_list[0] === rpctype.JSON_TYPE.REQUEST)
    })
    it('error_code', () => {
        assert(rpctype.detectErrorCodeType(-32700) === rpctype.ERROR_REASON.PARSE_ERROR)
        assert(rpctype.detectErrorCodeType(-32600) === rpctype.ERROR_REASON.INVALID_REQUEST)
        assert(rpctype.detectErrorCodeType(-32601) === rpctype.ERROR_REASON.METHOD_NOT_FOUND)
        assert(rpctype.detectErrorCodeType(-32602) === rpctype.ERROR_REASON.INVALID_PARAMS)
        assert(rpctype.detectErrorCodeType(-32603) === rpctype.ERROR_REASON.INTERNAL_ERROR)
        assert(rpctype.detectErrorCodeType(-32000) === rpctype.ERROR_REASON.SERVER_ERROR)
        assert(rpctype.detectErrorCodeType(-32099) === rpctype.ERROR_REASON.SERVER_ERROR)
        assert(rpctype.detectErrorCodeType(-1) === rpctype.ERROR_REASON.USER_DEFINE)
    })
})
describe('jsonrpc_type error', () => {
    it('resolveResponseError', () => {
        try{
            const res = rpctype.resolveResponseError(JSON.parse(fixture.unknown))
            assert(0)
        }catch(e){
        }
    })
    it('resolveResponse', () => {
        try{
            const res = rpctype.resolveResponse(JSON.parse(fixture.unknown))
            assert(0)
        }catch(e){
        }
    })
    it('resolveRequest', () => {
        try{
            const res = rpctype.resolveRequest(JSON.parse(fixture.unknown))
            assert(0)
        }catch(e){
        }
    })
    it('resolveNotification', () => {
        try{
            const res = rpctype.resolveNotification(JSON.parse(fixture.unknown))
            assert(0)
        }catch(e){
        }
    })
    it('resolveBatch', () => {
        try{
            const res = rpctype.resolveBatch(JSON.parse(fixture.unknown))
            assert(0)
        }catch(e){
        }
    })
})
