# geth-healthcheck

Little http node.js server to run along the geth node. Returns **503 Service Unavailable** if the last block number on the local node is off by 2 or more blocks from the last block nubmer from Etherscan. Otherwise returns **200 OK**

## Usage

``ETHERSCAN_API_KEY=vfvdf PORT=50336 node index.js``

## License

MIT

## Credits

Powered by Etherscan.io APIs
