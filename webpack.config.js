const pathUtil = require('path');
const webpack = require('webpack');

const srcPath  = pathUtil.join(__dirname, 'src');
const distPath = pathUtil.join(__dirname, 'dist');


module.exports = {
  entry: {
    app: './src/index.js'
  },


  output: {
    path: distPath,
    filename: 'index.js',
    library: 'Validation',
    libraryTarget: 'umd'
  },


  module: {
    preLoaders: [{
      test: /\.(js)$/,
      include: srcPath,
      loader: 'eslint-loader'
    }],


    loader: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ],
  }


  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        sequences     : true,
        properties    : true,
        dead_code     : true,
        conditionals  : true,
        comparisons   : true,
        loops         : true,
        unused        : true,
        if_return     : true,
        drop_debugger : false,
        global_defs: {
          DEBUG: false
        }
      }
    })
  ],


  resolve: {
    extensions: ['.js'],
    alias: {
    }
  }
};
