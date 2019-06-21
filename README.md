# eth-node-healthcheck

Little http node.js server to run along the ethereum node. Node needs to have JSONRPC enabled. Returns **503 Service Unavailable** if the last block number on the local node is off by 3 or more blocks from the last block number from Infura node. Otherwise returns **200 OK**.

Supported networks:


## Installation

```
npm install -g eth-node-healthcheck
```

## Run

Configuration parameters (set as ENV variables):

- RPC_HOST — hostname where your node JSON RPC is running. Default: `localhost`

- NETWORK — network name. Supported networks:
  - homestead
  - rinkeby
  - ropsten
  - kovan
  - goerli

- PORT — port to run this service on

Example for mainnet:
```
RPC_HOST=127.0.0.1 NETWORK=homestead PORT=50336 eth-node-healthcheck
```

Make sure the process is detached from the terminal. Make sure the port is open for incoming connections.

## License

MIT