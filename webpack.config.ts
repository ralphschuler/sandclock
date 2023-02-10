import * as path from 'path'

import * as copyWebpackPlugin from 'copy-webpack-plugin'
import * as htmlWebpackPlugin from 'html-webpack-plugin'

export default {
  mode: 'development',
  entry: './src/main.ts',
  devServer: {
    port: 9000,
    static: {
      serveIndex: true,
      directory: __dirname
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'index.ejs',
      title: 'My App'
    }),
    new copyWebpackPlugin({
      patterns: [
        { from: 'assets/', to: 'assets/' }
      ]
    })
  ]
}
