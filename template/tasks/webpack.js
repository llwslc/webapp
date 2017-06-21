
const config = require('../config');
const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const util = require('./util');

var baseWebpackCfg = function (prjName)
{
  var resolve = function (dir)
  {
    return path.join(__dirname, '..', prjName, dir)
  }

  return {
    entry: {
      build: resolve('/src/main.js')
    },
    output: {
      path: resolve('dist'),
      filename: 'js/[name].js'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        'assets': resolve('src/assets'),
        'components': resolve('src/components'),
        'services': resolve('/src/sections'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {extractCSS: true}
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        options: {
          presets: [
            ["env",
            {
              "targets": {
                "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
              },
              "modules": false,
            }],
            "stage-2"
          ],
          plugins: ["transform-runtime"],
          comments: false,
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader'],
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'css/[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('index.html'),
        inject: true
      }),
      new Webpack.NoEmitOnErrorsPlugin()
    ],
  };
};

var devHotWebpackCfg = function (prjName)
{
  var baseCfg = baseWebpackCfg(prjName);
  baseCfg.devtool = '#cheap-module-eval-source-map';
  baseCfg.plugins.push(new Webpack.HotModuleReplacementPlugin({}));
  baseCfg.plugins.push(new Webpack.DefinePlugin({
    'process.env': '"development"'
  }));
  return baseCfg;
};

var devPackWebpackCfg = function (prjName)
{
  var baseCfg = baseWebpackCfg(prjName);
  baseCfg.devtool = '#source-map';

  return baseCfg;
};

var prodWebpackCfg = function (prjName)
{
  var baseCfg = baseWebpackCfg(prjName);
  baseCfg.plugins.push(
    new Webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );

  return baseCfg;
};

var startDevServer = function (prjName)
{
  util.webpackLog.info(`Starting...`);

  var webpackConfig = devHotWebpackCfg(prjName);

  var compiler = Webpack(webpackConfig);
  var server = new WebpackDevServer(compiler,
  {
    hot: true,
    stats: {
      colors: true
    }
  });

  server.listen(config.webpackDev.port, function ()
  {
    util.webpackLog.info(`Starting server on http://localhost:${config.webpackDev.port}`);
  });
};

var startPackServer = function (prjName)
{
  util.webpackLog.info(`Starting...`);

  var webpackConfig = devPackWebpackCfg(prjName);

  Webpack(webpackConfig, function (err, stats)
  {
    if (err)
    {
      util.webpackLog.error(err.message)
    }
    else
    {
      util.webpackLog.info('Build complete.\n')
    }
  })
};

var webpackBuild = function (prjName)
{
  util.webpackLog.info(`Starting...`);

  var webpackConfig = prodWebpackCfg(prjName);

  Webpack(webpackConfig, function (err, stats)
  {
    if (err)
    {
      util.webpackLog.error(err.message)
    }
    else
    {
      util.webpackLog.info('Build complete.\n')
    }
  })
};


var webpackDir = config.webpackDir[0];
if (!!process.argv[3])
{
  webpackDir = process.argv[3];
}

if (process.argv[2] == 'dev')
{
  startDevServer(webpackDir);
}
else if (process.argv[2] == 'pack')
{
  startPackServer(webpackDir);
}
else if (process.argv[2] == 'build')
{
  webpackBuild(webpackDir);
}
else
{
  util.logger.info(`Nothing to do...`);
}
