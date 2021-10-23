const { readFileSync } = require('fs');
const { join } = require('path');
const jwkToPem = require('jwk-to-pem');
const jsonwebtoken = require('jsonwebtoken');

const { downloadJwks } = require('./utils');

class AwsCognitoJwtVerifier {
  constructor({ userPoolId, region, keyDir, clientId, acceptType }){
    this.userPoolId = userPoolId;
    this.region = region;
    this.keyDir = keyDir;
    this.clientId = clientId;
    this.accessType = acceptType;
    this.setup = this.setup.bind(this);
    this.verifier = this.verifier.bind(this);
  };
  async setup() {
    await downloadJwks(this.userPoolId, this.region, this.keyDir);
    this.accessJwks = JSON.parse(readFileSync(join(this.keyDir, `${this.userPoolId}.access.jwks.json`), {encoding: 'utf-8'}));
    this.idJwks = JSON.parse(readFileSync(join(this.keyDir, `${this.userPoolId}.id.jwks.json`), {encoding: 'utf-8'}));
    return;
  }
  verifier(req, res, next) {
    const authHeader = req.get('Authorization') || req.get('authorization');
    if (!authHeader) {
      return res.status(401).send({ message: 'Unathorized. "Authorization" header not found' });
    }
    const jwt = String(authHeader).split(' ')[1];
    if (!jwt) {
      return res.status(401).send({ message: 'Unauthorized. No/Invalid JWT provided.' });
    }
    const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/g;
    const matched = jwt.match(jwtRegex);
    if (!matched || matched.length === 0) {
      return res.status(400).send({message: 'Bad request. Invalid JWT structure'});
    }
    const decodedToken = jsonwebtoken.decode(jwt, {complete: true});
    let jwksToUse;
    // console.log(this);
    if (decodedToken.payload.token_use === 'access') {
      jwksToUse = this.accessJwks;
    } else if (decodedToken.payload.token_use === 'id') {
      jwksToUse = this.idJwks;
    }
    let validCount = 0;
    // Verify the kid matches
    if (decodedToken.header.kid === jwksToUse.kid) {
      validCount += 1;
    }
    // verify the token using public key generated from jwks
    const publicKey = jwkToPem(jwksToUse);
    let verifiedDecodedToken;
    try {
      verifiedDecodedToken = jsonwebtoken.verify(jwt, publicKey, { algorithms: ['RS256'] });
      validCount += 1;
    } catch(err) {
      return res.status(401).send({ message: 'Unauthorized', error: err.message });
    }
    // verify the token issuer is using provided client id or not.
    if (verifiedDecodedToken.iss === `https://cognito-idp.us-east-1.amazonaws.com/${this.userPoolId}`) {
      validCount += 1;
    }
    // check the token_use claim
    if (verifiedDecodedToken.token_use === this.accessType) {
      validCount += 1;
    }
    if (validCount !== 4) {
      return res.status(400).send({ message: 'Bad request. Error occurred while validating JWT' });
    }
    next();
  }
}

module.exports = AwsCognitoJwtVerifier;
