#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { exec } = require('child_process');

const etherscanPrefix = process.env.NETWORK == 'rinkeby' ? 'api-rinkeby' : 'goerli' ? 'api-goerli' : 'api';

const ETHERSCAN_URL = `https://${etherscanPrefix}.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${process.env.ETHERSCAN_API_KEY}`;
const MAX_BLOCK_DIFFERENCE = 3;

const getLocalBlockNum = () => {
  const host = process.env.RPC_HOST || 'localhost';
  return new Promise((resolve, reject) => {
    exec(`curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST ${host}:8545`, (error, stdout, stderr) => {
      if (error) {
        return reject(`${error}`);
      }
      resolve(parseInt(JSON.parse(stdout.trim()).result));
    });
  });
};

const getNetworkBlockNum = () => {
  return new Promise((resolve, reject) => {
    https.get(ETHERSCAN_URL, (res) => {
      if (res.statusCode !== 200) {
        //return reject(`Etherscan responded with ${res.statusCode}`);
        return resolve(-1);
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        resolve(parseInt(JSON.parse(rawData).result, 16));
      });
    }).on('error', (e) => {
      reject(e.message);
    });
  });
};

const onHealthcheckRequest = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  Promise.all([getLocalBlockNum(), getNetworkBlockNum()])
    .then((values) => {
      const [ localBlockNum, networkBlockNum ] = values;
      let responseStatus = networkBlockNum - localBlockNum > MAX_BLOCK_DIFFERENCE ? 500 : 200;
      if (localBlockNum > 10000 && networkBlockNum <= 0) { // don't let etherscan f**k us
        responseStatus = 200;
      }
      res.writeHead(responseStatus, { 'Content-Type': 'text/plain' });
      res.end((localBlockNum - networkBlockNum).toString());
    }).catch(e => {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(e);
    });
};

http.createServer(onHealthcheckRequest).listen(process.env.PORT);
