const ElectrumClient = require('..')

const main = async () => {
    const ecl = new ElectrumClient(995, 'btc.smsys.me', 'tls')
    await ecl.connect()
    try{
        const ver = await ecl.server_version("2.7.11", "1.0")
        console.log(ver)
    }catch(e){
        console.log(e)
    }
    await ecl.close()
}
main()
