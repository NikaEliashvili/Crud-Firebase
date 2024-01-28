import { EnvironmentPlugin } from 'webpack';
const Dotenv = require('dotenv-webpack');
module.exports = {
  plugins: [new Dotenv()],
};

// const webpack = require('webpack');
// const config = require('dotenv').config();

// module.exports = {
//   // some config
//   plugins: [new webpack.EnvironmentPlugin(config.parsed)],
// };
