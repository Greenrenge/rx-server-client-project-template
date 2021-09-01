import * as path from 'path';
// @ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import HtmlWebPackPlugin from 'html-webpack-plugin';
// @ts-ignore
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {Configuration, HotModuleReplacementPlugin} from 'webpack';
// @ts-ignore
import OptimizeJsPlugin from 'optimize-js-plugin';
// @ts-ignore
import CopyWebpackPlugin from 'copy-webpack-plugin';
// @ts-ignore
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
// @ts-ignore
import TerserPlugin from 'terser-webpack-plugin';
// @ts-ignore
import ThreadsPlugin from 'threads-plugin';
// @ts-ignore
import nodeExternals from 'webpack-node-externals';
// @ts-ignore
import HtmlWebpackPartialsPlugin from 'html-webpack-partials-plugin';

type ProjectTargets = { [key in ProjectTargetName]: ProjectTarget };

type ProjectTargetName = 'client' | 'server';

interface ProjectTarget {
   readonly entry: string;
   readonly distDir: string;
   readonly output: string;
   readonly target: 'web' | 'node';
   readonly title?: string;
   readonly assetDir?: string;
   readonly distAssetDir?: string;
   readonly baseUrl?: string;
}

const projectTargets: ProjectTargets = {
   client: {
      entry: 'src/app/client/client-main.ts',
      distDir: 'dist/client',
      output: 'main.js',
      target: 'web',
      title: 'Client version',
      assetDir: 'src/asset',
      distAssetDir: 'asset',
      baseUrl: '.',
   },
   server: {
      entry: 'src/app/server/server-main.ts',
      distDir: 'dist/server',
      output: 'main.js',
      target: 'node',
   },
};

export const webpackConfiguration = (env: string, argv: { [key: string]: string }, targetName: ProjectTargetName): Configuration => {
   function isProd(): boolean {
      return argv.mode === 'production';
   }

   const target = projectTargets[targetName];
   console.log('Target:', targetName, target);
   console.log('Entry: ', path.resolve(__dirname, target.entry));
   console.log('Output path: ', path.resolve(__dirname, target.distDir));

   /*
    * Plugins
    */
   const plugins: unknown[] = [
      new MiniCssExtractPlugin({
         filename: '[name].bundle.css',
         chunkFilename: '[id].css',
      }),
   ];
   if (isProd() && (targetName === 'client' || targetName === 'server')) {
      plugins.push(
         new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, target.distDir + '/**/*')],
         }),
      );
   }
   console.log(targetName, targetName==='client')
   if (targetName === 'client') {
      plugins.push(
         new ThreadsPlugin({
            globalObject: 'self',
         }),
      );
      if (isProd()) {
         plugins.push(
            new ReplaceInFileWebpackPlugin([
               {
                  dir: target.distDir,
                  files: [target.output],
                  rules: [
                     {
                        search: '.worker.js',
                        replace: '.worker.js?' + Date.now(),
                     },
                  ],
               },
            ]),
            new ReplaceInFileWebpackPlugin([
               {
                  dir: target.distDir,
                  files: ['index.html'],
                  rules: [
                     {
                        // Avoid caching after build
                        search: target.output,
                        replace: `${target.output}?${Date.now()}`,
                     },
                     // {
                     //    search: `<meta name="base" content="${target.baseUrl}">`,
                     //    replace: `<meta name="base" content="${target.baseUrl}">\n<meta http-equiv="cache-control" content="no-cache" />`
                     // }
                  ],
               },
            ]),
            new CopyWebpackPlugin({patterns: [{from: target.assetDir, to: target.distAssetDir}]}),
         );
      } else {
         plugins.push(new HotModuleReplacementPlugin());
      }
      plugins.push(
         new HtmlWebPackPlugin({
            filename: 'index.html',
            title: target.title,
            meta: {
               base: '/',
               viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
               'theme-color': '#000000',
            },
         }),
      );

      // plugins.push(
      //    new HtmlWebpackPartialsPlugin({
      //      path: './src/main/client/index.partial.html',
      //   }),
      //);
   }

   /*
    * Minimizers
    */
   const minimizers = [
      new OptimizeJsPlugin({
         sourceMap: !isProd(),
      }),
   ];

   if (isProd() && target.target === 'web') {
      minimizers.push(
         new TerserPlugin({
            parallel: false,
            terserOptions: {
               ecma: 2015,
               keep_classnames: false,
               keep_fnames: false,
               compress: {
                  drop_console: true,
               },
            },
         }),
      );
   }

   return {
      entry: path.resolve(__dirname, target.entry),
      watch: !isProd(),
      output: {
         path: path.resolve(__dirname, target.distDir),
         filename: target.output,
         pathinfo: false,
      },
      target: target.target,
      externals:
         target.target === 'node'
            ? [
               nodeExternals({
                  // whitelist: [/^three/, /^shared/],
               }),
            ]
            : [],
      resolve: {
         extensions: [
            '.tsx',
            ...(() => (isProd() ? ['.prod.ts'] : []))(), // This will override dev config with prod
            '.ts',
            '.js',
         ],
      },
      devtool: !isProd() ? 'inline-source-map' : false,
      module: {
         rules: [
            {
               test: /\.css$/,
               use: ['style-loader', 'css-loader'],
            },
            {
               test: /\.scss$/,
               use: [
                  'style-loader',
                  'css-loader',
                  'resolve-url-loader',
                  'sass-loader',
               ],
            },
            {
               test: /\.tsx?$/,
               use: [
                  'babel-loader',
                  {
                     loader: 'ts-loader',
                     options: {
                        transpileOnly: true, // Disabled due to performance reasons
                        experimentalWatchApi: !isProd(),
                        compilerOptions: {
                           // module: 'esnext',
                        },
                     },
                  },
               ],
            },
            {
               test: /\.html$/,
               use: [
                  {
                     loader: 'html-loader',
                     options: {
                        minimize: true,
                     },
                  },
               ],
            },
            {
               test: /\.(png|jpg|jpeg|gif|svg|bin|glb|gltf|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
               use: [
                  {
                     loader: 'file-loader',
                     options: {
                        name: '[path]/[name].[ext]',
                        outputPath: (url: string, resourcePath: string, context: string) => {
                           if (isProd()) {
                              // Remove "src/" from asset imports in prod. It is necessary only locally
                              return path.relative(context, resourcePath).replace(path.normalize('src/'), '');
                           } else {
                              return url;
                           }
                        },
                     },
                  },
               ],
            },
            {
               test: /\.(gltf)$/,
               use: ['gltf-webpack-loader'],
            },
         ],
      },
      optimization: {
         minimize: false, // isProd(),
         minimizer: minimizers,
      },
      // @ts-ignore
      plugins: plugins,
   };
};
