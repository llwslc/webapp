
const exec = require('child_process').exec;
const util = require('./util');


var startWebServer = function ()
{
  util.serverLog.info(`Starting...`);

  let child = exec(`node ./server/index.js`);

  child.stdout.on('data', data =>
  {
    data = data.replace(/\n$/g, '');
    util.serverLog.info(data);
  });

  child.stderr.on('data', error =>
  {
    error = error.replace(/\n$/g, '');
    util.serverLog.error(error);
  });

  child.on('exit', code =>
  {
    util.serverLog.info(`${code}`);
  });
};


if (process.argv[2] == 'server')
{
  startWebServer();
}
else
{
  util.logger.info(`Nothing to do...`);
}
