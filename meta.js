
module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application Name'
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project Description',
      default: 'A webapp project'
    },
    author: {
      type: 'string',
      label: 'Author'
    },
    mongoose: {
      type: 'confirm',
      require: true,
      message: 'Use mongoose ?',
      default: true
    },
    sqlite: {
      type: 'confirm',
      require: true,
      message: 'Use sqlite ?',
      default: true
    },
  },
  filters: {
    'tasks/install.js': 'rebuild',
    'app/src/sections/forkJs.js': 'fork',
    'app/update.js': 'update',
    'tasks/mac/*': 'installer',
    'tasks/win/*': 'installer',
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
