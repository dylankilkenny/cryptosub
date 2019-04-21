const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

let API_URL = require('./api.json');

const environment = process.env.NODE_ENV === 'prod' ? 'prod' : 'dev';

module.exports = {
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?retainLines=true'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   test: /\.less$/,
      //   use:
      //     [
      //       "style-loader",
      //       {
      //         loader: 'css-loader',
      //         options: {sourceMap: 1}
      //       },
      //       {
      //         loader: 'postcss-loader',
      //         options: {
      //           plugins: () => [require('autoprefixer')]
      //         }
      //       },
      //       "less-loader"
      //     ]
      // },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      debug: true,
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin({
      API_URL: API_URL[environment],
      GA_KEY: JSON.stringify(process.env.GA_KEY)
    }),
    new BundleAnalyzerPlugin()
  ]
};
