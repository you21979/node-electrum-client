const ElectrumClient = require('..')

const main = async () => {
    const ecl = new ElectrumClient(50002, 'bitcoins.sk', 'tls')
    await ecl.connect()
    try{
        const ver = await ecl.server_version("3.0.5", "1.1")
        console.log(ver)
        const balance = await ecl.blockchainScripthash_getBalance("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
        console.log(balance)
        const unspent = await ecl.blockchainScripthash_listunspent("676ca8550e249787290b987e12cebdb2e9b26d88c003d836ffb1cb03ffcbea7c")
        console.log(unspent)
    }catch(e){
        console.log(e)
    }
    await ecl.close()
}
main().catch(console.log)
