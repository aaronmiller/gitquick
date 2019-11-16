const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: path.join(__dirname, 'src'),

  entry: {
    bundle: './js/index.js'
  },

  output: {
    path: path.join(__dirname),
    filename: 'dist/js/bundle.js'
  },

  devServer: {
    hot: true,
    inline: true,
    stats: {
      colors: true
    },
    port: 1337
  },
  
  module: {
    rules: [
      // JavaScript Rules
      {
        test: /\.js?$/,
        exclude: [
          path.join(__dirname, 'node_modules')
        ]
      },
      // CSS Rules
      {
        test: /\.css?$/,
        use: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap'])
      },
      // Less Rules
      {
        test: /\.less?$/,
        use: ExtractTextPlugin.extract(['css-loader?sourceMap','less-loader?sourceMap'])
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('dist/css/bundle.css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['bundle']
    })
  ],
};

module.exports = config;
