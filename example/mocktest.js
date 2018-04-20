const electrumclient = require('..')
const Client = electrumclient.MockClient
const ElectrumProtocol = electrumclient.v4.ElectrumProtocol

const proc = async (ecl) => {
    mockresp(ecl, "xxxxxxxxxxxxxxxxxxxxxx")
    const tx1 = await ecl.blockchain_transaction_get("f91d0a8a78462bc59398f2c5d7a84fcff491c26ba54c4833478b202796c8aafd")
    console.log(tx1)
    mockresp(ecl, { txid: "xxxxxxxxxxxxx" })
    const tx2 = await ecl.blockchain_transaction_getParsed("f91d0a8a78462bc59398f2c5d7a84fcff491c26ba54c4833478b202796c8aafd")
    console.log(JSON.stringify(tx2, null, 2))
}

const mockresp = (ecl, result) => {
    const msg = JSON.stringify({
        jsonrpc: "2.0",
        id: ecl.client.seq + 1,
        result: result,
    })
    setTimeout( () => {
        ecl.client.injectResponse(msg+"\n")
    }, 1)
}

const main = async () => {
    // autogenerate client name
    const myname = [ElectrumProtocol.libname, ElectrumProtocol.hash].join('-')
    console.log(myname)

    // initialize
    const ecl = new ElectrumProtocol(new Client(995, 'btc.smsys.me', 'tls'))

    // wait a connection
    await ecl.client.connect()

    try{
        mockresp(ecl, ["MockClient 0.1", "1.2"])
        // negotiation protocol
        const res = await ecl.server_version(myname)
        console.log(res)
    }catch(e){
        // negotiation error
        await ecl.client.close()
        console.log(e)
        return;
    }

    try{
        await proc(ecl)
    }catch(e){
        console.log(e)
    }
    await ecl.client.close()
}
main().catch(console.log)
