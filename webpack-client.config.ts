import {Configuration} from 'webpack';
import {webpackConfiguration} from './webpack.config';

module.exports = (env: string, argv: { [key: string]: string }): Configuration =>
   webpackConfiguration(env, argv, 'client');
