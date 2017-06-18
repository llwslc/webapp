
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
  },
  complete: (data) =>
  {
    var oldPath = `${data.destDirName}/server/${data.dbCfg}`;
    var newPath = `${data.destDirName}/server/db`;
    if (fs.existsSync(newPath))
    {
      console.error(`${oldPath} cant rename ${newPath}!`);
      console.error(`Because ${newPath} is existed.`);
    }
    else
    {
      fs.renameSync(oldPath, newPath);
    }
  },
  completeMessage: `---

All set. More configurations can be made at \x1b[33m{{destDirName}}/config.js\x1b[0m.

Next steps:
  1.
     \x1B[32mcd {{destDirName}}\x1b[0m
  2.
     \x1B[32mnpm i\x1b[0m
  3.
     If \x1B[1mrebuild\x1b[0m flag is true. Need to be modified at \x1b[33m{{destDirName}}/tasks/install.js\x1b[0m.
     If \x1B[1mfork\x1b[0m flag is true. Need to be modified at \x1b[33m{{destDirName}}/app/src/sections/forkJs.js\x1b[0m.
     If \x1B[1mupdate\x1b[0m flag is true. Need to be modified at \x1b[33m{{destDirName}}/app/electron.js:57 (update.setFeedURL)\x1b[0m.
     If \x1B[1minstaller\x1b[0m flag is true. Need to be modified at \x1b[33m{{destDirName}}/tasks/win/vdprojConfig.json\x1b[0m.
  4.
     \x1B[32mnpm run dev\x1b[0m`
}
