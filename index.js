#!/usr/bin/env node

const ethers = require('ethers');
const http = require('http');

const port = process.env.PORT || 80
const url = process.env.RPC_URL || 'http://localhost:8545';
const networkString = process.env.NETWORK_URL || 'https://rpc.bitkubchain.io';
const networks = networkString.split(',')

const localProvider = new ethers.providers.JsonRpcProvider(url);
const MAX_BLOCK_DIFFERENCE = process.env.MAX_BLOCK_DIFFERENCE || 3;

let networkIndex = 0
const getPublicNetworkBlockNum = async () => {
  const provider = new ethers.providers.JsonRpcProvider(networks[networkIndex]);
  const publicBlockNum = await provider.getBlockNumber();
  if (networks.length <= networkIndex) {
    networkIndex = 0
  } else {
    networkIndex++
  }
  return publicBlockNum
}
 
const onHealthcheckRequest = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let localBlockNum;
  let networkBlockNum;

  try {
    networkBlockNum = await getPublicNetworkBlockNum()
  } catch (error) {
    console.log(`Fetch network ${network}, error: Cannot connect network.`)
    console.error(e);
    networkBlockNum = 0;
  }

  try {
    localBlockNum = await localProvider.getBlockNumber();
  } catch (e) {
    console.log(`Fetch local ${url}, error: Cannot connect local.`)
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(e);
    return;
  }

  console.log(`Fetch network ${network} -> local ${url}, last block: ${networkBlockNum} --> ${localBlockNum}`)

  let responseStatus = networkBlockNum - localBlockNum > MAX_BLOCK_DIFFERENCE ? 500 : 200;
  if (localBlockNum > 10000 && networkBlockNum <= 0) { // don't let etherscan f**k us
    responseStatus = 200;
  } else if (networkBlockNum < localBlockNum) {
    responseStatus = 200;
  }
  res.writeHead(responseStatus, { 'Content-Type': 'text/plain' });
  res.end((localBlockNum - networkBlockNum).toString());
};

http.createServer(onHealthcheckRequest)
  .listen(port, () => {
    console.log(`Start port ${port}`);
  });
