
const config = require('../config');
const async = require('async');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const util = require('./util');

var allPackage = config.allPackage;

var initAllPackage = function ()
{
  util.npmLog.info(`Init all package...`);

  initCfg(`.`);

  var waterIndex = -1;
  var waterfallFuncArr = [function (cb) {cb(null, null)}];

  for (var i = 0, iLen = allPackage.length; i < iLen; ++i)
  {
    var wfunc = function (res, cb)
    {
      waterIndex++;
      initPackage(allPackage[waterIndex], cb)
    };
    waterfallFuncArr.push(wfunc)
  }

  async.waterfall(waterfallFuncArr, function (err, res)
  {
    if (err)
    {
      util.npmLog.error(err);
    }
    else
    {
      util.npmLog.info(`Initialized all package...`);
    }
  });
};

var initPackage = function (dir, cb)
{
  util.npmLog.info(`Init ${dir} package...`);

  initCfg(dir);

  exec('cd $(dir) && npm i', (error, stdout, stderr) =>
  {
    if (error)
    {
      cb(error, null);
    }
    else
    {
      cb(null, null)
    }
  });
};

var initCfg = function (dir)
{
  var samplePath = path.join(`./`, dir, sample.config.js);
  var configPath = path.join(`./`, dir, config.js);
  if (fs.existsSync(samplePath))
  {
    if (!fs.existsSync(configPath))
    {
      fs.writeFileSync(configPath, fs.readFileSync(samplePath));
    }
  }
};


if (!!process.argv[2])
{
  initPackage(process.argv[2], function () {});
}
else
{
  initAllPackage();
}
