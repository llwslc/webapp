
const config = require('../../config');
const sqlite = require('better-sqlite3');

var sqliteDao = function ()
{
  let self = this;

  let db = new sqlite(config.sqlite.path);

  self.db = db;
  var stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='account'`);
  var tables = stmt.all();
  if (tables.length == 0)
  {
    stmt = db.prepare(`CREATE TABLE 'account' (
    '_id' INTEGER NOT NULL PRIMARY KEY,
    'acc' INTEGER NOT NULL UNIQUE,
    'pwd' TEXT NOT NULL
    )`);
    stmt.run();
  }

  self.account = require('./account')(db);

  console.log('Sqlite opend..');
};


module.exports = sqliteDao;
