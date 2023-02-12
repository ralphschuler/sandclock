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
    },
    devMiddleware: {
      writeToDisk: true,
    }
  },
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js', '.glsl']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.glsl$/,
        use: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: 'fallback',
            filename: 'worker.js'
          }
        },
        exclude: /node_modules/
      }
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
