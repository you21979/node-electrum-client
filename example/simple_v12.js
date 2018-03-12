const ElectrumClient = require('..')

const main = async () => {
    const ecl = new ElectrumClient(995, 'btc.smsys.me', 'tls')
    await ecl.connect()
    try{
        const ver = await ecl.server_version("0", "1.2")
        console.log(ver)
        const balance = await ecl.blockchainAddress_getBalance("12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX")
        console.log(balance)
        const unspent = await ecl.blockchainAddress_listunspent("12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX")
        console.log(unspent)
        const tx1 = await ecl.blockchainTransaction_get("f91d0a8a78462bc59398f2c5d7a84fcff491c26ba54c4833478b202796c8aafd", false)
        console.log(tx1)
        const tx2 = await ecl.blockchainTransaction_get("f91d0a8a78462bc59398f2c5d7a84fcff491c26ba54c4833478b202796c8aafd", true)
        console.log(JSON.stringify(tx2, null, 2))
    }catch(e){
        console.log(e)
    }
    await ecl.close()
}
main().catch(console.log)
