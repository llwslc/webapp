
const config = require('../config');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const util = require('./util');

var dbBindIp = config.mongodb.bindIp;
var dbPort = config.mongodb.port;
var dbPath = config.mongodb.path;
var dbLog = config.mongodb.log;


var startMongodb = function ()
{
  util.mongoLog.info(`Starting...`);

  exec(`mongo --port ${dbPort} --eval "db.runCommand({dbHash: 1})"`, (error, stdout, stderr) =>
  {
    if (error)
    {
      exec(`mongod --bind_ip ${dbBindIp} --port ${dbPort} --dbpath ${dbPath} --fork --logpath ${path.join(dbPath, dbLog)}`);
    }
    util.mongoLog.info(`Has started...`);
  });
};

var closeMongodb = function ()
{
  util.mongoLog.info(`Closing...`);

  exec(`mongo --port ${dbPort} admin --eval "db.shutdownServer()"`, (error, stdout, stderr) =>
  {
    if (error)
    {
      util.mongoLog.error(error);
    }
    else
    {
      util.mongoLog.info(`Has closed...`);
    }
  });
};


if (process.argv[2] == 'mongo:open')
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
