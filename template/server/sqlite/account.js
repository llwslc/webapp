
const util = require('./util');

var accountTable = function (db)
{
  let self = this;

  self.tableName = 'account';

  self.login = function (acc, pwd)
  {

    let sql = `SELECT _id FROM '${self.tableName}' WHERE acc = '${acc}' AND pwd = '${pwd}'`;
    return util.dbRun(db, sql);
  };

  self.findAcc = function (acc)
  {
    let sql = `SELECT * FROM '${self.tableName}' WHERE acc = '${acc}'`;
    return util.dbRun(db, sql);
  };

  self.register = function (acc, pwd)
  {
    let sql = `INSERT INTO '${self.tableName}' (acc, pwd) VALUES ('${acc}', '${pwd}')`;
    return util.dbRun(db, sql);
  };

  self.loginById = function (id, pwd)
  {
    let sql = `SELECT * FROM '${self.tableName}' WHERE _id = '${id}' AND pwd = '${pwd}'`;
    return util.dbRun(db, sql);
  };

  self.pwdModify = function (id, pwd)
  {
    let sql = `UPDATE '${self.tableName}' SET pwd = '${pwd}' WHERE _id = '${id}'`;
    return util.dbRun(db, sql);
  };
}


module.exports = (db) => new accountTable(db);
