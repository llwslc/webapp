
const config = require('../config');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const dbObj = require('./db/db');
const accountRouter = require('./router/account');

const app = express();
const serverPort = config.express.port;
const jwtUnless = {
  path: [
    {url: /^(?!\/api)/},
    '/api/account/login',
    '/api/account/register',
    {url: /(.*)/, methods: ['OPTIONS']}
  ]
};
const setHeader = function (req, res)
{
  res.header('Access-Control-Max-Age', 60 * 60 * 24);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
};

global.db = new dbObj();

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expJwt({
  secret: config.jwt.secret,
  userProperty: config.jwt.userProperty,
  getToken: function (req)
  {
    return req.cookies[config.jwt.cookieKey];
  },
}).unless(jwtUnless));
app.use(function (err, req, res, next)
{
  setHeader(req, res);
  if (err.name === 'UnauthorizedError') res.status(401).end();
});
app.use(function (req, res, next)
{
  let tokenObj = req[config.jwt.userProperty];
  if (!!tokenObj)
  {
    let tokenTime = tokenObj.exp;
    let nowTime = Date.now() / 1000;
    if ((tokenTime - nowTime) < config.jwt.refreshTime)
    {
      tokenObj.exp = Math.floor(Date.now() / 1000) + config.jwt.exp;
      tokenObj.iat = Math.floor(Date.now() / 1000);
      let token = jwt.sign(tokenObj, config.jwt.secret);
      res.cookie(config.jwt.cookieKey, token, {httpOnly: true});
    }
  }
  next();
});
app.use(function (req, res, next)
{
  setHeader(req, res);
  next();
});

app.get('/', function (req, res)
{
  res.send('GET request to homepage');
});

app.post('/getToken', function (req, res)
{
  var token = jwt.sign({data: 'test', exp: Math.floor(Date.now() / 1000) + (60 * 60)}, config.jwt.secret);
  res.cookie(config.jwt.cookieKey, token, {httpOnly: true});
  res.end();
});

app.post('/delToken', function (req, res)
{
  res.clearCookie(config.jwt.cookieKey);
  res.end();
});

app.post('/checkToken', function (req, res)
{
  res.end();
});

app.post('/', function (req, res)
{
  res.send('POST request to homepage');
});

app.post('/api/account/:method', accountRouter);

app.listen(serverPort, function ()
{
  console.log(`Express started on port ${serverPort}...`);
});
