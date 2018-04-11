export interface IProtocolV0_9{
    server_version: (client_name: string, protocol_version: string) => Promise<string>
}
export interface IProtocolV1_0{
    server_version: (client_name: string, protocol_version: string) => Promise<string>
}
export interface IProtocolV1_1{
    server_version: (client_name: string, protocol_version: string) => Promise<string[]>
}

