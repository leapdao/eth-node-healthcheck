# eth-node-healthcheck

Little http node.js server to run along the ethereum node. Node needs to have JSONRPC enabled. Returns **503 Service Unavailable** if the last block number on the local node is off by 3 or more blocks from the last block nubmer from Etherscan. Otherwise returns **200 OK**.

Supported networks:
- mainnet
- rinkeby

## Installation

```
npm install -g eth-node-healthcheck
```

## Run

for mainnet:
```
ETHERSCAN_API_KEY=<etherscan_api_key> PORT=50336 eth-node-healthcheck
```

for rinkeby:
```
ETHERSCAN_API_KEY=<etherscan_api_key> PORT=50336 NETWORK=rinkeby eth-node-healthcheck
```

Make sure the process is detached from the terminal. Make sure the port is open for incoming connections.

## License

MIT

## Credits

Powered by Etherscan.io APIs
