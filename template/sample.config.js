
var config = {

  // webpack dir
  webpackDir: ['client'],

  // server package
  serverDir: ['server'],

  // webpack-dev-server config
  webpackDev: {
    port: 8080
  },

  // express config
  express: {
    port: 3000,
  },

  // express-jwt config
  jwt: {
    secret: 'xxx',
    userProperty: 'jwtData',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 6),
    iat: Math.floor(Date.now() / 1000),
    cookieKey: 'X-Token',
    refreshTime: 60 * 60 * 24,
  },

{{#if_eq dbCfg "mongoose"}}
  // mongodb config
  mongodb: {
    bindIp: 'localhost',
    port: 28073,
    db: '{{name}}',
    path: './db',
    log: 'db.log',
  },
{{/if_eq}}

{{#if_eq dbCfg "sqlite"}}
  // sqlite config
  sqlite: {
    path: '{{name}}.db'
  }
{{/if_eq}}
};


module.exports = config
