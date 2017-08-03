
const fs = require(`fs`);

module.exports = {
  prompts: {
    name: {
      type: `editor`,
      message: `Application Name`
    },
    description: {
      type: `editor`,
      message: `Project Description`,
      default: `A webapp project`
    },
    author: {
      type: `editor`,
      message: `Author`,
      default: `llwslc <llwslc@gmail.com>`
    },
    dbCfg: {
      type: `list`,
      message: `Pick a db dirver`,
      choices: [
        `mongoose`,
        `sqlite`,
        `none`
      ]
    },
  },
  filters: {
    'server/sqlite/*': `dbCfg !== 'mongoose'`,
    'server/mongoose/*': `dbCfg !== 'sqlite'`,
    'server/+(mongoose|sqlite)/*': `dbCfg !== 'none'`,
    'tasks/mongo.js': `dbCfg !== 'mongoose'`,
    'server/router/sqliteAccount.js': `dbCfg !== 'mongoose'`,
    'server/router/mongooseAccount.js': `dbCfg !== 'sqlite'`,
  },
  complete: (data) =>
  {
    var renameFunc = function (oldPath, newPath)
    {
      if (fs.existsSync(newPath))
      {
        console.error(`${oldPath} cant rename ${newPath}!`);
        console.error(`Because ${newPath} is existed.`);
      }
      else
      {
        fs.renameSync(oldPath, newPath);
      }
    }

    if (data.dbCfg !== 'none')
    {
      renameFunc(`${data.destDirName}/server/${data.dbCfg}`, `${data.destDirName}/server/db`);
      renameFunc(`${data.destDirName}/server/router/${data.dbCfg}Account.js`, `${data.destDirName}/server/router/account.js`);
    }

    console.log(`---

  All set. More configurations can be made at \x1b[33m${data.destDirName}/config.js\x1b[0m.

  Next steps:
    1.
       \x1B[32mcd ${data.destDirName}\x1b[0m
    2.
       \x1B[32mnpm i\x1b[0m
    3.
       \x1B[32mnpm run dev\x1b[0m for client
       \x1B[32mnpm run start\x1b[0m for server`);
  },
};
