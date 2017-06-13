
const config = require('../config');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const util = require('./util');

var dbPath = config.mongodb.path;
var dbPort = config.mongodb.port;
var dbLog = config.mongodb.log;

var startMongodb = function ()
{
  util.mongoLog.info(`Starting...`);

  if (!fs.existsSync(dbPath))
  {
    fs.mkdirSync(dbPath);
  }

  exec(`mongo --port ${dbPort} --eval "db.adminCommand('listDatabases')"`, (error, stdout, stderr) =>
  {
    if (error)
    {
      exec(`mongod --dbpath ${dbPath} --port ${dbPort} --fork --logpath ${path.join(dbPath, dbLog)}`);
    }

    util.mongoLog.info(`Has started...`);
  });
};

var closeMongodb = function ()
{
  util.mongoLog.info(`Closing...`);

  exec(`mongo --port ${dbPort} admin --eval "db.shutdownServer()"`);
  util.mongoLog.info(`Has closed...`);
};

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
  startMongodb();
  startWebServer();
}
else if (process.argv[2] == 'mongo:open')
{
  startMongodb();
}
else if (process.argv[2] == 'mongo:close')
{
  closeMongodb();
}
else
{
  util.logger.info(`Nothing to do...`);
}
