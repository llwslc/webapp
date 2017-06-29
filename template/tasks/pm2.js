
const config = require('../config');
const exec = require('child_process').exec;
const util = require('./util');
const pkgInfo = require('../package');


var startPm2 = function ()
{
  util.pm2Log.info(`Starting...`);

  util.execAsync(util.pm2Log, `pm2 start npm --name ${pkgInfo.name} -- start`, _ => {});
};


startPm2();
