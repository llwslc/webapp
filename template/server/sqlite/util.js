
var dbRun = function (db, sql)
{
  let stmt = {};
  let res = [];

  try
  {
    stmt = db.prepare(sql);

    if (/^SELECT/i.test(sql))
    {
      res = stmt.all();
    }
    else if (/^(UPDATE|DELETE)/i.test(sql))
    {
      if (stmt.run().changes > 0)
      {
        res = [{}];
      }
    }
    else if (/^INSERT/i.test(sql))
    {
      res.push({_id: stmt.run().lastInsertROWID});
    }
  }
  catch (err)
  {
    console.log(err.message);
  }

  return res;
};


module.exports = {dbRun};
