# geth-healthcheck

Little http node.js server to run along the geth node. Returns **503 Service Unavailable** if the last block number on the local node is off by 4 or more blocks from the last block nubmer from Etherscan. Otherwise returns **200 OK**

## Installation
1. Install node.js if needed:
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Get the app:
```
wget https://raw.githubusercontent.com/acebusters/geth-healthcheck/master/index.js
```

3. Run the app:
```
ETHERSCAN_API_KEY=<etherscan_api_key> PORT=50336 node index.js
```

for rinkeby network:
```
ETHERSCAN_API_KEY=<etherscan_api_key> PORT=50336 NETWORK=rinkeby node index.js
```

Make sure it is detached from the terminal. Make sure the port is open for incoming connections.

## License

MIT

## Credits

Powered by Etherscan.io APIs
