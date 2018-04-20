// this file is auto generated.
import {ISocketEvent} from './socket_helper'



// 
export interface ICoinBalance {
    confirmed: string
    unconfirmed: string
}


// 
export interface IBlockHeader {
    nonce: number
    prev_block_hash: string
    timestamp: number
    merkle_root: string
    block_height: number
    utxo_root: string
    version: number
    bits: number
}


export class ElectrumProtocol{
    static libname: string = "javascript client"
    static version: string = "0.9"
    static hash: string = "9cf247cde7cb11ec34ad729365cd5efed55466fcbed7e762a33f7651836ed348"
    client: ISocketEvent
    constructor(client: ISocketEvent){
        this.client = client
        this.client.subscribe.on('close', () => { this.onClose() })
    }
    // 
    public server_version ( client_version: string, protocol_version: string = '0.9' ): Promise<string> {
        return this.client.request("server.version", [ client_version, protocol_version ])
    }
    // 
    public server_banner (  ): Promise<string> {
        return this.client.request("server.banner", [  ])
    }
    // 
    public server_donationAddress (  ): Promise<string> {
        return this.client.request("server.donation_address", [  ])
    }
    // 
    public server_features (  ): Promise<object> {
        return this.client.request("server.features", [  ])
    }
    // They don’t send notifications yet
    public server_peers_subscribe (  ): Promise<Array<object>> {
        return this.client.request("server.peers.subscribe", [  ])
    }
    // 
    public blockchain_transaction_broadcast ( rawtx: string ): Promise<string> {
        return this.client.request("blockchain.transaction.broadcast", [ rawtx ])
    }
    // 
    public blockchain_transaction_getMerkle ( tx_hash: string, tx_height: number ): Promise<string> {
        return this.client.request("blockchain.transaction.get_merkle", [ tx_hash, tx_height ])
    }
    // 
    public blockchain_transaction_get ( tx_hash: string ): Promise<string> {
        return this.client.request("blockchain.transaction.get", [ tx_hash ])
    }
    // 
    public blockchain_estimatefee ( target_block: number ): Promise<number> {
        return this.client.request("blockchain.estimatefee", [ target_block ])
    }
    // 
    public blockchain_address_getProof ( address: string ): Promise<object> {
        return this.client.request("blockchain.address.get_proof", [ address ])
    }
    // 
    public blockchain_block_getHeader ( height: number ): Promise<object> {
        return this.client.request("blockchain.block.get_header", [ height ])
    }
    // 
    public blockchain_block_getChunk ( index: number ): Promise<string> {
        return this.client.request("blockchain.block.get_chunk", [ index ])
    }
    // 
    public blockchain_address_getBalance ( address: string ): Promise<ICoinBalance> {
        return this.client.request("blockchain.address.get_balance", [ address ])
    }
    // 
    public blockchain_address_getHistory ( address: string ): Promise<Array<object>> {
        return this.client.request("blockchain.address.get_history", [ address ])
    }
    // 
    public blockchain_address_getMempool ( address: string ): Promise<Array<object>> {
        return this.client.request("blockchain.address.get_mempool", [ address ])
    }
    // 
    public blockchain_address_listunspent ( address: string ): Promise<Array<object>> {
        return this.client.request("blockchain.address.listunspent", [ address ])
    }
    // 
    public blockchain_utxo_getAddress ( tx_hash: string, index: string ): Promise<object> {
        return this.client.request("blockchain.utxo.get_address", [ tx_hash, index ])
    }
    // 
    public blockchain_address_subscribe ( address: string ): Promise<string> {
        return this.client.request("blockchain.address.subscribe", [ address ])
    }
    // 
    public blockchain_numblocks_subscribe (  ): Promise<number> {
        return this.client.request("blockchain.numblocks.subscribe", [  ])
    }
    // 
    public blockchain_headers_subscribe (  ): Promise<IBlockHeader> {
        return this.client.request("blockchain.headers.subscribe", [  ])
    }

    onClose(): void{
        const list: Array<string> = []
        list.push("blockchain.address.subscribe")
        list.push("blockchain.numblocks.subscribe")
        list.push("blockchain.headers.subscribe")
        list.forEach(event => this.client.subscribe.removeAllListeners(event))
    }
}

export namespace validate {
    export const ICoinBalance = ( obj: object ): boolean => {
        if(!( 'confirmed' in obj )){
            return false;
        }
        if(!( 'unconfirmed' in obj )){
            return false;
        }
        return true;
    }
    export const IBlockHeader = ( obj: object ): boolean => {
        if(!( 'nonce' in obj )){
            return false;
        }
        if(!( 'prev_block_hash' in obj )){
            return false;
        }
        if(!( 'timestamp' in obj )){
            return false;
        }
        if(!( 'merkle_root' in obj )){
            return false;
        }
        if(!( 'block_height' in obj )){
            return false;
        }
        if(!( 'utxo_root' in obj )){
            return false;
        }
        if(!( 'version' in obj )){
            return false;
        }
        if(!( 'bits' in obj )){
            return false;
        }
        return true;
    }
}


