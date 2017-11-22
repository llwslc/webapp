
const config = require('../config');
const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const opn = require('opn');
const util = require('./util');


var resolve = function (dir)
{
  return path.join(__dirname, '..', webpackDir, dir);
};

var specialWebpack = function (cfg, build)
{
  var compiler = Webpack(cfg);

  if (!!build)
  {
    compiler.run(function (err, stats)
    {
      if (err)
      {
        util.webpackLog.error(err.stack || err);
        if (err.details)
        {
          util.webpackLog.error(err.details);
        }
      }
      else
      {
        if (stats.hasErrors())
        {
          stats.compilation.errors.forEach(function (err) {util.webpackLog.error(err);});
        }

        if (stats.hasWarnings())
        {
          stats.compilation.warnings.forEach(function (err) {util.webpackLog.warn(err);});
        }
      }
    });
  }

  return compiler;
};

var baseWebpackCfg = function ()
{
  var useBabelLoader = [
  {
    loader: 'babel-loader',
    options: {
      presets: [
        ['env',
        {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
          },
          modules: false,
        }],
        'stage-2'
      ],
      plugins: ['transform-runtime'],
      comments: false,
    }
  }];

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [
        require('autoprefixer')
      ]
    }
  };

  return {
    entry: {
      build: resolve('src/main.js')
    },
    output: {
      path: resolve('dist'),
      filename: 'assets/js/[name].[hash:7].js',
      // 规定网站根目录位置，让css中引用的图片路径正确
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        'assets': resolve('src/assets'),
        'components': resolve('src/components'),
        'services': resolve('src/services'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          loaders: {js: useBabelLoader},
          postcss: [
            require('autoprefixer')()
          ]
        }
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: useBabelLoader
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', postcssLoader],
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader', postcssLoader],
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/fonts/[name].[hash:7].[ext]'
        }
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'assets/css/[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }),
      new Webpack.NoEmitOnErrorsPlugin(),
      new Webpack.ProvidePlugin({})
    ],
  };
};

var devHotWebpackCfg = function ()
{
  var baseCfg = baseWebpackCfg();
  baseCfg.devtool = '#cheap-module-eval-source-map';
  baseCfg.plugins.push(new Webpack.HotModuleReplacementPlugin({}));
  baseCfg.plugins.push(new Webpack.DefinePlugin({
    'process.env': '"development"'
  }));
  return baseCfg;
};

var prodWebpackCfg = function ()
{
  var baseCfg = baseWebpackCfg();

  baseCfg.plugins.push(
    new Webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count)
      {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            resolve('node_modules')
          ) === 0
        );
      }
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new CopyWebpackPlugin([
    {
      from: resolve('src/assets'),
      to: resolve('dist/assets')
    }])
  );
  return baseCfg;
};

var startDevServer = function ()
{
  util.webpackLog.info(`Starting...`);

  var webpackConfig = devHotWebpackCfg();
  var port = config.webpackDev.port[webpackDir];

  WebpackDevServer.addDevServerEntrypoints(webpackConfig, {host: 'localhost', port: port, hot: true});

  var compiler = specialWebpack(webpackConfig);
  var server = new WebpackDevServer(compiler,
  {
    contentBase: resolve('src'),
    hot: true,
    stats: {
      colors: true
    },
    // 禁用Host检查，允许其他网络访问
    disableHostCheck: true,
    proxy: config.webpackDev.proxy
  });
  server.openUrl = true;
  compiler.plugin('done', () =>
  {
    if (server.openUrl)
    {
      opn(`http://localhost:${port}`);
      server.openUrl = false;
    }
  });

  server.listen(port, function ()
  {
    util.webpackLog.info(`Dev server listening at ${port}, waiting for compiler...`);
  });
};

var webpackBuild = function ()
{
  util.webpackLog.info(`Starting...`);

  var webpackConfig = prodWebpackCfg();

  util.delDirAsync(util.webpackLog, resolve('dist'), function ()
  {
    var compiler = specialWebpack(webpackConfig, true);
    compiler.plugin('done', () =>
    {
      util.webpackLog.info(`Build complete.\n`);
    });
  });
};


var webpackDir = config.webpackDir[0];
if (!!process.argv[3])
{
  webpackDir = process.argv[3];
}

if (process.argv[2] == 'dev')
{
  startDevServer();
}
else if (process.argv[2] == 'build')
{
  webpackBuild();
}
else
{
  util.logger.info(`Nothing to do...`);
}
