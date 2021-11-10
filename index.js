#!/usr/bin/env node

const ethers = require('ethers');
const http = require('http');

const port = process.env.PORT || 80
const url = process.env.RPC_URL || 'http://localhost:8545';
const network = process.env.NETWORK_URL || 'https://rpc.bitkubchain.io';

const provider = new ethers.providers.JsonRpcProvider(network);
const localProvider = new ethers.providers.JsonRpcProvider(url);
const MAX_BLOCK_DIFFERENCE = process.env.MAX_BLOCK_DIFFERENCE || 3;

const onHealthcheckRequest = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let localBlockNum;
  let networkBlockNum;

  try {
    localBlockNum = await localProvider.getBlockNumber();
    networkBlockNum = await provider.getBlockNumber();
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(e);
  }

  let responseStatus = networkBlockNum - localBlockNum > MAX_BLOCK_DIFFERENCE ? 500 : 200;
  if (localBlockNum > 10000 && networkBlockNum <= 0) { // don't let etherscan f**k us
    responseStatus = 200;
  }
  res.writeHead(responseStatus, { 'Content-Type': 'text/plain' });
  res.end((localBlockNum - networkBlockNum).toString());
};

http.createServer(onHealthcheckRequest)
  .listen(port, () => {
    console.log(`Start port ${port}`);
  });
