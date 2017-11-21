const http = require('http');
const https = require('https');
const { exec } = require('child_process');

const ETHERSCAN_URL = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${process.env.ETHERSCAN_API_KEY}`;

const getLocalBlockNum = () => {
  return new Promise((resolve, reject) => {
    exec('geth --exec eth.blockNumber attach', (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(parseInt(stdout.trim()));
    });
  });
};

const getNetworkBlockNum = () => {
  return new Promise((resolve, reject) => {
    https.get(ETHERSCAN_URL, (res) => {
      if (res.statusCode !== 200) {
        return reject(`Etherscan responded with ${res.statusCode}`);
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
  Promise.all([getLocalBlockNum(), getNetworkBlockNum()])
    .then((values) => {
      const [ localBlockNum, networkBlockNum ] = values;
      const responseStatus = networkBlockNum - localBlockNum > 1 ? 500 : 200;
      res.writeHead(responseStatus, { 'Content-Type': 'text/plain' });
      res.end((localBlockNum - networkBlockNum).toString());
    }).catch(e => {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(e);
    });
};

http.createServer(onHealthcheckRequest).listen(process.env.PORT);
