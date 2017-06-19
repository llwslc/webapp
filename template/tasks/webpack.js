
const config = require('../config');
const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const util = require('./util');


var baseWebpackCfg = function (prjName, mainPath)
{
  var resolve = function (dir)
  {
    return path.join(__dirname, '..', prjName, dir)
  }

  return {
    entry: {
      build: resolve(mainPath)
    },
    output: {
      path: resolve('dist'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'assets': resolve('src/assets'),
        'components': resolve('src/components'),
        'services': resolve('/src/sections'),
        'vonic': 'vonic/src/index.js',
      }
    },
    module: {
      rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ["env", {"modules": false}],
            "stage-2"
          ],
          "plugins": ["transform-runtime"],
          "comments": false,
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', {loader: 'css-loader'}]
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', {loader: 'sass-loader'}]
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
      new ExtractTextPlugin('styles.css'),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('index.html'),
        inject: true
      }),
      new Webpack.ProvidePlugin({}),
      new Webpack.NoEmitOnErrorsPlugin()
    ],
  };
};

var devHotWebpackCfg = function (prjName, mainPath)
{
  var baseCfg = baseWebpackCfg(prjName, mainPath);
  baseCfg.devtool = '#cheap-module-eval-source-map';

  return baseCfg;
};

var devPackWebpackCfg = function (prjName, mainPath)
{
  var baseCfg = baseWebpackCfg(prjName, mainPath);
  baseCfg.devtool = '#source-map';

  return baseCfg;
};

var prodWebpackCfg = function (prjName, mainPath)
{
  var baseCfg = baseWebpackCfg(prjName, mainPath);
  baseCfg.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );

  return baseCfg;
};

var startDevServer = function ()
{
  util.serverLog.info(`Starting...`);

  var webpackConfig = devHotWebpackCfg('client', '/src/main.js');

  var compiler = Webpack(webpackConfig);
  var server = new WebpackDevServer(compiler,
  {
    hot: true,
    stats: verbose
  });

  server.listen(8080, "127.0.0.1", function ()
  {
    console.log("Starting server on http://localhost:8080");
  });
};


if (process.argv[2] == 'dev')
{
  startDevServer();
}
else if (process.argv[2] == 'pack')
{
  startWebServer();
}
else if (process.argv[2] == 'build')
{
  startWebServer();
}
else
{
  util.logger.info(`Nothing to do...`);
}
