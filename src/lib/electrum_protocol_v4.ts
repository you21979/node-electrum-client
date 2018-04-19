import {Client} from './client'

// this file is auto generated.
export const document = {
    hash : "4a59589e50ccbe3acf25c1f0c52d28da51149994be3b00f037172be517853131"
}



// 
export interface ICoinBalance {
    confirmed: string
    unconfirmed: string
}


// 
export interface IBlockHeader {
    height: number
    hex: string
}


// 
export interface ITxMerkle {
    merkle: Array<string>
    block_height: number
    pos: number
}


// 
export interface ITxInfoMempool {
    tx_hash: string
    height: number
    fee: number
}


export class ElectrumProtocol extends Client{
    static version: string = "1.2"
    constructor(port, host, protocol, options){
        super(port, host, protocol, options)
    }
    // Identify the client to the server and negotiate the protocol version.
    public server_version ( client_name: string, protocol_version: [string,string] = ['1.2', '1.2'] ): Promise<string> {
        return this.request("server.version", [ client_name, protocol_version ])
    }
    // 
    public server_banner (  ): Promise<string> {
        return this.request("server.banner", [  ])
    }
    // 
    public server_donationAddress (  ): Promise<string> {
        return this.request("server.donation_address", [  ])
    }
    // 
    public server_features (  ): Promise<object> {
        return this.request("server.features", [  ])
    }
    // They don’t send notifications yet
    public server_peers_subscribe (  ): Promise<Array<object>> {
        return this.request("server.peers.subscribe", [  ])
    }
    // 
    public blockchain_transaction_broadcast ( rawtx: string ): Promise<string> {
        return this.request("blockchain.transaction.broadcast", [ rawtx ])
    }
    // Return the markle branch to a confirmed transaction given its hash and height.
    public blockchain_transaction_getMerkle ( tx_hash: string, tx_height: number ): Promise<ITxMerkle> {
        return this.request("blockchain.transaction.get_merkle", [ tx_hash, tx_height ])
    }
    // Return a raw transaction.
    public blockchain_transaction_get ( tx_hash: string, verbose: boolean = false ): Promise<string> {
        return this.request("blockchain.transaction.get", [ tx_hash, verbose ])
    }
    // Return a transaction.
    public blockchain_transaction_getParsed ( tx_hash: string, verbose: boolean = true ): Promise<object> {
        return this.request("blockchain.transaction.get", [ tx_hash, verbose ])
    }
    // 
    public blockchain_estimatefee ( target_block: number ): Promise<number> {
        return this.request("blockchain.estimatefee", [ target_block ])
    }
    // 
    public blockchain_address_getProof ( address: string ): Promise<object> {
        return this.request("blockchain.address.get_proof", [ address ])
    }
    // 
    public blockchain_block_getHeader ( height: number ): Promise<object> {
        return this.request("blockchain.block.get_header", [ height ])
    }
    // Subscribe to receive block headers when a new block is found.
    public blockchain_headers_subscribe ( raw: boolean = true ): Promise<IBlockHeader> {
        return this.request("blockchain.headers.subscribe", [ raw ])
    }
    // Return the confirmed and unconfirmed balances of a script hash.
    public blockchain_scripthash_getBalance ( scripthash: string ): Promise<ICoinBalance> {
        return this.request("blockchain.scripthash.get_balance", [ scripthash ])
    }
    // Return the confirmed and unconfirmed history of a script hash.
    public blockchain_scripthash_getHistory ( scripthash: string ): Promise<Array<object>> {
        return this.request("blockchain.scripthash.get_history", [ scripthash ])
    }
    // Return the unconfirmed transactions of a script hash.
    public blockchain_scripthash_getMempool ( scripthash: string ): Promise<Array<ITxInfoMempool>> {
        return this.request("blockchain.scripthash.get_mempool", [ scripthash ])
    }
    // 
    public blockchain_scripthash_listunspent ( scripthash: string ): Promise<object> {
        return this.request("blockchain.scripthash.listunspent", [ scripthash ])
    }
    // 
    public blockchain_scripthash_subscribe ( scripthash: string ): Promise<object> {
        return this.request("blockchain.scripthash.subscribe", [ scripthash ])
    }
    // 
    public server_ping (  ): Promise<void> {
        return this.request("server.ping", [  ])
    }
    // Return a histogram of the fee rates paid by transactions in the memory pool, weighted by transaction size. [fee, vsize] pairs
    public mempool_getFeeHistogram (  ): Promise<Array<[number, number]>> {
        return this.request("mempool.get_fee_histogram", [  ])
    }

    onClose(): void{
        super.onClose()
        const list: Array<string> = []
        list.push("blockchain.headers.subscribe")
        list.push("blockchain.scripthash.subscribe")
        list.forEach(event => this.subscribe.removeAllListeners(event))
    }
}


