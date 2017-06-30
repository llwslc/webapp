
const config = require('../../config');
const mongoose = require('mongoose');

var mongodbDao = function ()
{
  let self = this;

  self.dbUri = `mongodb://${config.mongodb.bindIp}:${config.mongodb.port}/${config.mongodb.db}`;
  self.dbConn = mongoose.connect(self.dbUri, {useMongoClient: true}, function (err)
  {
    if (err)
    {
      console.error(err.message);
    }
    else
    {
      console.log('Mongodb opend..');

      self.account = require('./account');
    }
  });

  self.close = function ()
  {
    mongoose.disconnect();
  };
};


module.exports = mongodbDao;
