const fs = require('fs');
const https = require('https');
const { join } = require('path');

const utils = {};
utils.downloadFile = async (url) => {
  const reqUrl = new URL(url);
  const options = {
    hostname: reqUrl.hostname,
    port: 443,
    path: reqUrl.pathname,
    method: 'GET',
    headers: {
      'accept': 'application/json'
    },
    timeout: 15000
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error('Non 2XX return status.'+res.statusCode));
      }
      const responseBody = []
      res.on('data', (chunk) => responseBody.push(chunk));
      res.on('end', () => {
        const resString = Buffer.concat(responseBody).toString();
        resolve(resString);
      });
    });
    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after '+options.timeout));
    })
    req.end();
  });
};

utils.downloadJwks = async (userPoolId, region, keyDir) => {
  const jwksJson = await utils.downloadFile(`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`);
  const accessTokenJwks = JSON.parse(jwksJson).keys[1];
  const idTokenJwks = JSON.parse(jwksJson).keys[0];
  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir, { recursive: true });
  }
  fs.writeFileSync(join(keyDir, `${userPoolId}.access.jwks.json`), JSON.stringify(accessTokenJwks, null, 2));
  fs.writeFileSync(join(keyDir, `${userPoolId}.id.jwks.json`), JSON.stringify(idTokenJwks, null, 2));
};

module.exports = utils;
