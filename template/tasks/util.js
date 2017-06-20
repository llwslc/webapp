
const log4js = require('log4js');
const exec = require('child_process').exec;
const fs = require('fs');
const platform = require('os').platform();

var logger = log4js.getLogger();
var npmLog = log4js.getLogger('npm');
var webpackLog = log4js.getLogger('webpack');
var mongoLog = log4js.getLogger('mongo');
var serverLog = log4js.getLogger('server');

var hotEnv = 'cross-env NODE_ENV=developmentHot';
var packEnv = 'cross-env NODE_ENV=developmentPack';
var rlsEnv = 'cross-env NODE_ENV=production';

var execAsync = function (mLogger, cmd, cb)
{
  let child = exec(cmd, {encoding: 'binary'});
  child.stdout.on('data', data => mLogger.info(data));
  child.stderr.on('data', data => mLogger.error(data));
  child.on('exit', code =>
  {
    if (code != 0)
    {
      cb(`code : ${code}\nerror cmd: ${cmd}`, null);
    }
    else
    {
      cb(null, null);
    }
  });
};


module.exports = {
  log4js,
  logger,
  execAsync,
  npmLog,
  mongoLog,
  serverLog,
  hotEnv,
  packEnv,
  rlsEnv
};
