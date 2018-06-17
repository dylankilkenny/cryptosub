const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader?retainLines=true"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      { test: /\.css$/, 
        include: /node_modules/, 
        loaders: ['style-loader', 'css-loader'] 
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
      }    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      debug: true,
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};