const {AwsCognitoJwtVerifier} = require('../index');
const express = require('express');
const app = express();

const awsCognitoJwtVerifier = new AwsCognitoJwtVerifier({
  keyDir: 'publicKeys',
  userPoolId: 'us-east-1_Y4Xe2aq5C',
  region: 'us-east-1',
  clientId: '6ag3atq6jg34921ghs7dl1of2g',
  acceptType: 'access'
});

app.use(awsCognitoJwtVerifier.verifier);
app.get('/test', (req, res) => {
  res.status(200).send('Recieved.');
});

(async ()=>{
  const err = await awsCognitoJwtVerifier.setup();
  if (err) {
    console.log(err);
  }
  console.log('Setup Done.');
  app.listen(9009, () => console.log('Server started on port 9009'));
})();
