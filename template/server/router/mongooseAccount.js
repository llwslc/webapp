
const util = require('./util');
const errMsg = require('./errMsg');
const async = require('async');

var accountRouter = function (request, response)
{
  let self = this;

  self.login = function ()
  {
    let acc = self.contentObj.acc;
    let pwd = self.contentObj.pwd;

    if (util.paramCheck(self, acc, pwd)) return;

    db.account.login(acc, pwd, function (res)
    {
      if (res.length !== 0)
      {
        util.setJwtCookie(self, res);
        self.response.send(res);
      }
      else
      {
        util.returnErrMsg(self, errMsg.accountLoginErr);
      }
    });
  };

  self.register = function ()
  {
    let acc = self.contentObj.acc;
    let pwd = self.contentObj.pwd;

    if (util.paramCheck(self, acc, pwd)) return;

    async.waterfall([
      function (cb)
      {
        // regex acc
        cb(null, null);
      },
      function (res, cb)
      {
        db.account.findAcc(acc, function (res)
        {
          if (res.length == 0)
          {
            cb(null, null);
          }
          else
          {
            cb(errMsg.accountAlreadyRegistered, null);
          }
        });
      },
      function (res, cb)
      {
        db.account.register(acc, pwd, function (res)
        {
          if (res.length == 0)
          {
            cb(errMsg.serverErr, null);
          }
          else
          {
            util.setJwtCookie(self, res);
            cb(null, res);
          }
        });
      }
    ], function (err, res)
    {
      if (!!err)
      {
        util.returnErrMsg(self, err);
      }
      else
      {
        self.response.send(res);
      }
    });
  };

  self.pwdModify = function ()
  {
    let accId = self.tokenObj.accId;
    let oldPwd = self.contentObj.oldPwd;
    let newPwd = self.contentObj.newPwd;

    if (util.paramCheck(self, oldPwd, newPwd)) return;

    async.waterfall([
      function (cb)
      {
        db.account.loginById(accId, oldPwd, function (res)
        {
          if (res.length == 0)
          {
            cb(errMsg.accountPwdErr, null);
          }
          else
          {
            cb(null, null);
          }
        });
      },
      function (res, cb)
      {
        db.account.pwdModify(accId, newPwd, function (res)
        {
          if (res.length == 0)
          {
            cb(errMsg.serverErr, null);
          }
          else
          {
            cb(null, []);
          }
        });
      }
    ], function (err, res)
    {
      if (!!err)
      {
        util.returnErrMsg(self, err);
      }
      else
      {
        self.response.send(res);
      }
    });
  };

  self.logout = function ()
  {
    util.clearJwtCookie(self);
  };

  util.routerInit(self, request, response);
};


module.exports = (request, response) => new accountRouter(request, response);
