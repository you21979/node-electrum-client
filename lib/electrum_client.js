'use strict'

const Client = require("./client")

class ElectrumClient extends Client {

    constructor(port, host, protocol, options) {
        super(port, host, protocol, options);
        this.timeLastCall = 0;
    }

    initElectrum(electrumConfig, persistencePolicy = { maxRetry: 1000, callback: null }) {
        this.persistencePolicy = persistencePolicy;
        this.electrumConfig = electrumConfig;
        this.timeLastCall = 0;
        return this
            .connect()
            .then(() => this.server_version(this.electrumConfig.client, this.electrumConfig.version))
        ;   
    }

    // Override parent
    request(method, params) {
        this.timeLastCall = new Date().getTime();
         const parentPromise = super.request(method, params);
         return parentPromise
            .then((response) => {
                this.keepAlive();
                return response;
            })
        ;
    }

    onClose() {
        super.onClose()
        const list = [
            'server.peers.subscribe',
            'blockchain.numblocks.subscribe',
            'blockchain.headers.subscribe',
            'blockchain.address.subscribe'
        ];
        list.forEach(event => this.subscribe.removeAllListeners(event));
        setTimeout(() => {
            if (this.persistencePolicy != null && this.persistencePolicy.maxRetry > 0) {
                this.reconnect();
                this.persistencePolicy.maxRetry -= 1;
            } else if (this.persistencePolicy != null && this.persistencePolicy.callback != null) {
                this.persistencePolicy.callback();
            } else if (this.persistencePolicy == null) {
                this.reconnect();
            }
        }, 10000);
    }

    // ElectrumX persistancy
    keepAlive() {
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            if (this.timeLastCall !== 0 &&
                new Date().getTime() > this.timeLastCall + 10000/2) {
                this.server_ping();
            }
        }, 10000);
    }


    reconnect() {
        this.initSocketConnection();
        return this.initElectrum(this.electrumConfig);
    }

    // ElectrumX API
    server_version(client_name, protocol_version) {
        return this.request('server.version', [client_name, protocol_version]);
    }
    server_banner(){
        return this.request('server.banner', [])
    }
    server_ping(){
        return this.request('server.ping', [])
    }
    server_addPeer(features){
        return this.request('server.add_peer', [features])
    }
    serverDonation_address(){
        return this.request('server.donation_address', [])
    }
    serverPeers_subscribe(){
        return this.request('server.peers.subscribe', [])
    }
    blockchainAddress_getProof(address){
        return this.request('blockchain.address.get_proof', [address])
    }
    blockchainScripthash_getBalance(scripthash){
        return this.request('blockchain.scripthash.get_balance', [scripthash])
    }
    blockchainScripthash_getHistory(scripthash){
        return this.request('blockchain.scripthash.get_history', [scripthash])
    }
    blockchainScripthash_getMempool(scripthash){
        return this.request('blockchain.scripthash.get_mempool', [scripthash])
    }
    blockchainScripthash_listunspent(scripthash){
        return this.request('blockchain.scripthash.listunspent', [scripthash])
    }
    blockchainScripthash_subscribe(scripthash){
        return this.request('blockchain.scripthash.subscribe', [scripthash])
    }
    blockchainBlock_getHeader(height){
        return this.request('blockchain.block.get_header', [height])
    }
    blockchainBlock_headers(start_height, count){
        return this.request('blockchain.block.headeres', [start_height, count])
    }
    blockchainEstimatefee(number){
        return this.request('blockchain.estimatefee', [number])
    }
    blockchainHeaders_subscribe(raw){
        return this.request('blockchain.headers.subscribe', [raw ? raw : false])
    }
    blockchain_relayfee(){
        return this.request('blockchain.relayfee', [])
    }
    blockchainTransaction_broadcast(rawtx){
        return this.request('blockchain.transaction.broadcast', [rawtx])
    }
    blockchainTransaction_get(tx_hash, verbose){
        return this.request('blockchain.transaction.get', [tx_hash, verbose ? verbose : false])
    }
    blockchainTransaction_getMerkle(tx_hash, height){
        return this.request('blockchain.transaction.get_merkle', [tx_hash, height])
    }
    mempool_getFeeHistogram(){
        return this.request('mempool.get_fee_histogram', [])
    }
// ---------------------------------
// protocol 1.1 deprecated method
// ---------------------------------
    blockchainUtxo_getAddress(tx_hash, index){
        return this.request('blockchain.utxo.get_address', [tx_hash, index])
    }
    blockchainNumblocks_subscribe(){
        return this.request('blockchain.numblocks.subscribe', [])
    }
// ---------------------------------
// protocol 1.2 deprecated method
// ---------------------------------
    blockchainBlock_getChunk(index){
        return this.request('blockchain.block.get_chunk', [index])
    }
    blockchainAddress_getBalance(address){
        return this.request('blockchain.address.get_balance', [address])
    }
    blockchainAddress_getHistory(address){
        return this.request('blockchain.address.get_history', [address])
    }
    blockchainAddress_getMempool(address){
        return this.request('blockchain.address.get_mempool', [address])
    }
    blockchainAddress_listunspent(address){
        return this.request('blockchain.address.listunspent', [address])
    }
    blockchainAddress_subscribe(address){
        return this.request('blockchain.address.subscribe', [address])
    }
}

module.exports = ElectrumClient
