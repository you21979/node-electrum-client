# ???


blockchain.address.get_proof ????
 blockchain_address_get_proof(address: string): Array<any>


# stable

server.version
 server_version_1(client_version: string, protocol_version: string): string

server.version
 server_version_2(client_name: string, protocol_version: string): [string, string]

server.version
 server_version_3(client_name: string, protocol_version: [string, string]): [string, string]

server.banner
 server_banner(): string

server.donation_address
 server_donation_address(): string

server.features
 server_features(): Object

server.peers.subscribe
 server_peers_subscribe(): [string, string, Array<string>]

blockchain.block.get_header
 blockchain_block_get_header(height: number): Object

# deprecate_v1_2

blockchain.block.get_chunk
 blockchain_block_get_chunk(index: number): string

blockchain.address.get_balance
 blockchain_address_get_balance(address: string): Object

blockchain.address.get_history
 blockchain_address_get_history(address: string): Array<Object>

blockchain.address.get_mempool
 blockchain_address_get_mempool(address: string): Array<Object>

blockchain.address.listunspent
 blockchain_address_listunspent(address: string): Array<Object>

blockchain.address.subscribe
 blockchain_address_subscribe(address: string): string
 blockchain_address_subscribe_notification([address:string, txid:string])

# 1.0


# 1.1


# feature_v1.2

server.ping
 server_ping(): void

blockchain.block.headers
 blockchain_block_headers(start_height: number, count: number): Object

