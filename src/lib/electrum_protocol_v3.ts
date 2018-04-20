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


// result of blockchain.scripthash.get_mempool
export interface ITxInfoMempool {
    tx_hash: string
    height: number
    fee: number
}


// result of blockchain.scripthash.listunspent
export interface ITxInfoUnspent {
    tx_pos: number
    value: number
    tx_hash: string
    height: number
}


export class ElectrumProtocol{
    static libname: string = "javascript client"
    static version: string = "1.1"
    static hash: string = "490521be6a5183a0b120979c099ac4e0ba77f53dfde0bb1d6828bc5f0a9faa29"
    client: ISocketEvent
    constructor(client: ISocketEvent){
        this.client = client
        this.client.subscribe.on('close', () => { this.onClose() })
    }
    // A string identifying the server software.
    public server_version ( client_name: string, protocol_version: string = '1.1' ): Promise<string> {
        return this.client.request("server.version", [ client_name, protocol_version ])
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
    public blockchain_address_subscribe ( address: string ): Promise<string> {
        return this.client.request("blockchain.address.subscribe", [ address ])
    }
    // 
    public blockchain_headers_subscribe (  ): Promise<IBlockHeader> {
        return this.client.request("blockchain.headers.subscribe", [  ])
    }
    // Return the confirmed and unconfirmed balances of a script hash.
    public blockchain_scripthash_getBalance ( scripthash: string ): Promise<ICoinBalance> {
        return this.client.request("blockchain.scripthash.get_balance", [ scripthash ])
    }
    // Return the confirmed and unconfirmed history of a script hash.
    public blockchain_scripthash_getHistory ( scripthash: string ): Promise<Array<object>> {
        return this.client.request("blockchain.scripthash.get_history", [ scripthash ])
    }
    // Return the unconfirmed transactions of a script hash.
    public blockchain_scripthash_getMempool ( scripthash: string ): Promise<Array<ITxInfoMempool>> {
        return this.client.request("blockchain.scripthash.get_mempool", [ scripthash ])
    }
    // A list of unspent outputs in blockchain order. This function takes the mempool into account.
    public blockchain_scripthash_listunspent ( scripthash: string ): Promise<Array<ITxInfoUnspent>> {
        return this.client.request("blockchain.scripthash.listunspent", [ scripthash ])
    }
    // 
    public blockchain_scripthash_subscribe ( scripthash: string ): Promise<object> {
        return this.client.request("blockchain.scripthash.subscribe", [ scripthash ])
    }
    // 
    public server_addPeer ( features: object ): Promise<object> {
        return this.client.request("server.add_peer", [ features ])
    }

    onClose(): void{
        const list: Array<string> = []
        list.push("blockchain.address.subscribe")
        list.push("blockchain.headers.subscribe")
        list.push("blockchain.scripthash.subscribe")
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
    export const ITxInfoMempool = ( obj: object ): boolean => {
        if(!( 'tx_hash' in obj )){
            return false;
        }
        if(!( 'height' in obj )){
            return false;
        }
        if(!( 'fee' in obj )){
            return false;
        }
        return true;
    }
    export const ITxInfoUnspent = ( obj: object ): boolean => {
        if(!( 'tx_pos' in obj )){
            return false;
        }
        if(!( 'value' in obj )){
            return false;
        }
        if(!( 'tx_hash' in obj )){
            return false;
        }
        if(!( 'height' in obj )){
            return false;
        }
        return true;
    }
}


