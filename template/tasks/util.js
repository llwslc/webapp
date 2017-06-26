
const log4js = require('log4js');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const platform = require('os').platform();

exports.logger = log4js.getLogger();
exports.npmLog = log4js.getLogger('npm');
exports.webpackLog = log4js.getLogger('webpack');
exports.mongoLog = log4js.getLogger('mongo');
exports.serverLog = log4js.getLogger('server');

exports.execAsync = function (mLogger, cmd, cb)
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

exports.delDirAsync = function (mLogger, mPath, cb)
{
  mPath = path.resolve(__dirname, mPath)
  if (fs.existsSync(mPath))
  {
    if (!fs.statSync(mPath).isDirectory())
    {
      mLogger.error(`${mPath} not directiry!`);
      return;
    }
  }
  else
  {
    cb();
    return;
  }

  let delDirCmd = 'rm -rf';
  if (platform === 'win32')
  {
    delDirCmd = 'rmdir /s/q';
  }

  mLogger.info(`Delete ${mPath} dir...\n`);
  exports.execAsync(mLogger, `${delDirCmd} ${mPath}`, function (err, res)
  {
    if (!!err)
    {
      return;
    }
    else
    {
      cb();
    }
  });
}
