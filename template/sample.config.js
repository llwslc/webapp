
var config = {

  // all package
  allPackage: ['client', 'server'],

  // webpack-dev-server config
  webpackDev: {
    port: 8080
  },

  // webpack config
  webpackPath: {
    path: ''
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

  // mongodb config
  mongodb: {
    host: 'localhost',
    port: 28073,
    db: '{{name}}',
    path: './db',
    log: 'db.log',
  },

  // sqlite config
  sqlite: {
    path: '{{name}}.db'
  }
};


module.exports = config
