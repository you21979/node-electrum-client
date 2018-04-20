#!/bin/bash
./rpcgen/bin/gen.js -i fixture/idl/protocol_v4.xml -t fixture/template/protocol.ts.tmpl > src/lib/electrum_protocol_v4.ts
./rpcgen/bin/gen.js -i fixture/idl/protocol_v3.xml -t fixture/template/protocol.ts.tmpl > src/lib/electrum_protocol_v3.ts
./rpcgen/bin/gen.js -i fixture/idl/protocol_v2.xml -t fixture/template/protocol.ts.tmpl > src/lib/electrum_protocol_v2.ts
./rpcgen/bin/gen.js -i fixture/idl/protocol_v1.xml -t fixture/template/protocol.ts.tmpl > src/lib/electrum_protocol_v1.ts
