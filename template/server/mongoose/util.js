
var findCallback = function (err, res, cb)
{
  // for find findById findOne
  if (err)
  {
    console.error(err.message);
    cb([]);
  }
  else
  {
    if (res instanceof Array)
    {
      // find RES is array
      cb(res);
    }
    else
    {
      // findById findOne findByIdAndUpdate findOneAndUpdate RES is obj or null
      if (res === null)
      {
        cb([]);
      }
      else
      {
        cb([res]);
      }
    }
  }
};

var createCallback = function (err, res, cb)
{
  // for create
  if (err)
  {
    console.error(err.message);
    cb([]);
  }
  else
  {
    cb([{_id: res._id}]);
  }
};


module.exports = {findCallback, createCallback};
