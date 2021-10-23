# aws-cognito-jwt-verifier
> An express JS middleware for handling authentication requiring AWS Cognito JWTs.

## Usage

```js
const {AwsCognitoJwtVerifier} = require('aws-cognito-jwt-verifier');
const express = require('express');

const app = express();
const awsCognitoJwtVerifier = new AwsCognitoJwtVerifier({
  keyDir: 'keys',
  userPoolId: '<userpool id>',
  region: 'us-east-1',
  clientId: '<client id>',
  acceptType: 'access'
});

app.use(awsCognitoJwtVerifier.verifier);

app.get('/protected-route', (req, res) => {
  res.status(200).send('OK');
});

awsCognitoJwtVerifier.setup()
  .then((err) => {
    if (err) {
      console.log(err);
    }
    app.listen(9000, () => console.log('Server started'));
  })
  .catch(err => console.error(err));
```