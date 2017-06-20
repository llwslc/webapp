
const mongoose = require('mongoose');
const util = require('./util');

var accountSchema = new mongoose.Schema({
  acc: String,  // 用户名
  pwd: String,  // 密码
});

accountSchema.statics.login = function (acc, pwd, cb)
{
  let self = this;
  let doc = {acc: acc, pwd: pwd};
  let opt = {_id: true};

  self.find(doc, opt, (err, res) => util.findCallback.call(self, err, res, cb));
};


accountSchema.statics.findStu = function (acc, cb)
{
  let self = this;
  let doc = {acc: acc};
  let opt = {_id: true};

  self.find(doc, opt, (err, res) => util.findCallback.call(self, err, res, cb));
};

accountSchema.statics.register = function (acc, pwd, cb)
{
  let self = this;
  let doc = {acc: acc, pwd: pwd};

  self.create(doc, (err, res) => util.createCallback.call(self, err, res, cb));
};

accountSchema.statics.loginById = function (id, pwd, cb)
{
  let self = this;
  let doc = {_id: id, pwd: pwd};

  self.findOne(doc, (err, res) => util.findCallback.call(self, err, res, cb));
};

accountSchema.statics.pwdModify = function (id, pwd, cb)
{
  let self = this;
  let doc = {pwd: pwd};

  self.findByIdAndUpdate(id, doc, (err, res) => util.findCallback.call(self, err, res, cb));
};


module.exports = mongoose.model('account', accountSchema, 'account');
