
const async = require('async');
const fs = require('fs');
const path = require('path');
const util = require('./util');

var initCfg = function (dir)
{
  var samplePath = path.join(`./`, dir, 'sample.config.js');
  var configPath = path.join(`./`, dir, 'config.js');
  if (fs.existsSync(samplePath))
  {
    if (!fs.existsSync(configPath))
    {
      fs.writeFileSync(configPath, fs.readFileSync(samplePath));
    }
  }
};

initCfg(`.`);
const config = require('../config');
var allPackage = config.webpackDir.concat(config.serverDir);

var initAllPackage = function ()
{
  util.npmLog.info(`Init all package...`);

  var waterIndex = -1;
  var waterfallFuncArr = [function (cb) {cb(null, null);}];

  for (var i = 0, iLen = allPackage.length; i < iLen; ++i)
  {
    var wfunc = function (res, cb)
    {
      waterIndex++;
      initPackage(allPackage[waterIndex], cb);
    };
    waterfallFuncArr.push(wfunc);
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

  util.execAsync(util.npmLog, `cd ${dir} && npm i`, cb);
};


if (!!process.argv[2])
{
  if (process.argv[2] == 'postinstall')
  {
    initAllPackage();
  }
  else
  {
    initPackage(process.argv[2], function () {});
  }
}
else
{
  util.execAsync(util.npmLog, `npm i`, function (err, res)
  {
    if (!!!err)
    {
      initAllPackage();
    }
  });
}
