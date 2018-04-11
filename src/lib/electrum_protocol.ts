

export interface IDeprecatedProtocol{
    server_version: (client_name: string, protocol_version: string) => Promise<string>
}

export interface ICurrentProtocol{
    server_version: (client_name: string, protocol_version: string) => Promise<string[]>
}

export interface IProtocolV0_9 extends IDeprecatedProtocol{
    protocol_version: '0.9'
    blockchainUtxo_getAddress(tx_hash, index){
        return this.request('blockchain.utxo.get_address', [tx_hash, index])
    }
    blockchainNumblocks_subscribe(){
        return this.request('blockchain.numblocks.subscribe', [])
    }
// ----
}
export interface IProtocolV1_0{
    protocol_version: '1.0'
    server_version: (client_name: string, protocol_version: string) => Promise<string>
}
export interface IProtocolV1_1{
    protocol_version: '1.1'
    server_version: (client_name: string, protocol_version: string) => Promise<string[]>
}
export interface IProtocolV1_2{
    protocol_version: '1.2'
}
export interface IProtocolV1_3{
    protocol_version: '1.3'
    server_version: (client_name: string, protocol_version: string) => Promise<string[]>
}

