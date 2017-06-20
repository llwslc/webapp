
const config = require('../../config');
const errMsg = require('./errMsg');
const jwt = require('jsonwebtoken');

var routerInit = function (self, request, response)
{
  self.request = request;
  self.response = response;
  self.contentObj = request.body;
  self.tokenObj = request[config.jwt.userProperty];

  callRouterMethod(self);
};

var setJwtCookie = function (self, res)
{
  let payload = {
    accId: res[0]._id,
    exp: config.jwt.exp,
  };
  let token = jwt.sign(payload, config.jwt.secret);
  self.response.cookie(config.jwt.cookieKey, token, {httpOnly: true});
};

var clearJwtCookie = function (self)
{
  self.response.clearCookie(config.jwt.cookieKey);
  self.response.end();
};

var callRouterMethod = function (self)
{
  let reqMethod = self.request.params.method;
  if (!!reqMethod)
  {
    if (!!self[reqMethod])
    {
      self[reqMethod]();
    }
    else
    {
      console.error(`errUrl: ${self.response.originalUrl}`);
      self.response.status(400).end();
    }
  }
  else
  {
    self.response.status(400).end();
  }
};

var returnErrMsg = function (self, msg)
{
  self.response.statusMessage = errMsg.errStatusText;
  self.response.status(errMsg.errStatusCode).send(msg);
};

var paramCheck = function (self)
{
  for (var i = 0, iLen = arguments.length; i < iLen; ++i)
  {
    if (arguments[i] === undefined)
    {
      returnErrMsg(self, errMsg.paramErr);
      return true;
    }
  }

  return false;
};

module.exports = {routerInit, setJwtCookie, clearJwtCookie, returnErrMsg, paramCheck};
