# express-cognito-jwt-verifier
> An express JS middleware for authenticating requests containing AWS Cognito JWT as authentication mechanism.

This library handles :
1. **downloading**, **loading**, **reading** and **storing** JWKs. JWKs are converted to PEM formatted public keys. This public key is used to verify the JWT in the request.
2. Verification of JWT by checking its **structure**, **signature**, **issuer**, **audience**, **token type**, **expiration** and any other validation required.

## Getting Started

Get started by installing the library as a dependency for your project.

```sh
npm install --save express-cognito-jwt-verifier
```

## Usage

```js
// import module
const {AwsCognitoJwtVerifier} = require('express-cognito-jwt-verifier');
const express = require('express');

const app = express();
// create and setup an instance of AwsCognitoJwtVerifier.
// new AwsCognitoJwtVerifier(options)
const awsCognitoJwtVerifier = new AwsCognitoJwtVerifier({
  keyDir: 'keys',
  userPoolId: '<userpool id>',
  region: 'us-east-1',
  clientId: '<client id>',
  acceptType: 'access'
});
// use verifier() method as a middleware for express app
app.use(awsCognitoJwtVerifier.verifier);

app.get('/protected-route', (req, res) => {
  res.status(200).send('OK');
});

// call setup() method for initial setup of middleware.
// it returns a Promise. Use .then() or async/await.
// make sure setup() is resolved before calling listen() on express app.
awsCognitoJwtVerifier.setup()
  .then((err) => {
    if (err) {
      console.log(err);
    }
    app.listen(9000, () => console.log('Server started'));
  })
  .catch(err => console.error(err));
```

### Options

* `keyDir` [*required*]- Valid path to directory which will be used to store JWKS.
* `userPoolId` [*required*] - AWS Cognito user pool ID.
* `region` [*required*] - Region for AWS Cognito user pool.
* `clientId` [*required*] - Client ID of the underlying app client, using the provided user pool.
* `acceptType` [*required*] - Defined the usage of JWT. If you are accepting only Access Token use `access` else if using ID Token use `id`. If your app uses both JWTs, use `access-id`.

## References
* [Verifying a JSON Web Token - AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [jwk-to-pem](https://www.npmjs.com/package/jwk-to-pem)