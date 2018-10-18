const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';



const imageLoaders = [
  'file?name=assets/images/[path][name].[ext]?[sha512:hash:base64:7]',
];

// if (NODE_ENV === 'production') {
//   imageLoaders.push('image-optimize-loader');
// }

const config = {
  entry: {
    index: './frontend/main-app.js',
    //admin: './admin/index.js',
  },
  output: {
    path: `${__dirname}/www/`,
    filename: 'build/[name].js?[hash]',
  },
  resolve: {
    modulesDirectories: [
      './node_modules/',
      './frontend/_common/',
    ],
    extensions: ['', '.js', '.css'],

    alias: {
      TweenMax: 'gsap/src/uncompressed/TweenMax.js',
      TweenLite: 'gsap/src/uncompressed/TweenLite.js',
      TimelineLite: 'gsap/src/uncompressed/TimelineLite.js',
      TimelineMax: 'gsap/src/uncompressed/TimelineMax.js',
      CSSPlugin: 'gsap/src/uncompressed/plugins/CSSPlugin.js',
      EasePack: 'gsap/src/uncompressed/easing/EasePack.js',
      THREE: 'three/build/three.js',
      ScrollMagic: path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
    },
  },

  resolveLoader: {
    modulesDirectories: ['./node_modules/'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js'],
  },

  devServer: {
    contentBase: `${__dirname}/www`,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 100,
      poll: 1000,
    },
    // proxy: {
    //   '/api/*': 'http://giv.digital-easy.ru',
    //   '/swagger/*': 'http://giv.digital-easy.ru',
    // },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'frontend'), path.resolve(__dirname, 'admin')],
        exclude: /\/(node_modules|bower_components)\//,
        loader: 'es3ify!ng-annotate!babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.(jade|pug)$/,
        loader: 'html?interpolate&attrs=img:src xlink:href link:href source:src a:replace-href image:xlink:href!jade-html',
      },
      {
        test: /\.styl$/,
        loader:
          NODE_ENV !== 'production'
            ? 'style!css?minimize&-autoprefixer!postcss!stylus'
            : ExtractTextPlugin.extract('style', 'css?minimize&-autoprefixer!postcss!stylus'),
      },
      {
        test: /\.css$/,
        loader:
          NODE_ENV !== 'production'
            ? 'style!css?minimize&-autoprefixer!postcss'
            : ExtractTextPlugin.extract('style', 'css?minimize&-autoprefixer!postcss'),
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        loaders: imageLoaders,
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file?name=assets/fonts/[hash].[ext]',
      },
      {
        test: /\.(webm|ogv|mp4|pdf)$/,
        loader: 'file?name=assets/common/[path][name].[ext]?[sha512:hash:base64:7]',
      },
    ],

    noParse: [
      /angular.min.js/,
      /jquery.js/,
      /angular.js/,
    ],
  },

  stylus: {
    import: [
      '~stylus-mixins/index.styl',
    ],
  },

  postcss() {
    return [
      autoprefixer({
        browsers: ['last 3 version'],
      }),
    ];
  },

  devtool: NODE_ENV === 'production' ? null : 'inline-source-map',

  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new CopyWebpackPlugin([
      { from: './frontend/images/favicon.png' },
      { from: './frontend/images/favicon@2x.png' },
      { from: './frontend/images/og.png' },
    ]),
    new HtmlWebpackPlugin({
      template: 'frontend/index.jade',
      filename: 'index.html',
      chunks: ['index'],
    }),
    // new HtmlWebpackPlugin({
    //   title: 'Givenchy',
    //   template: 'admin/index.html',
    //   filename: 'admin/index.html',
    //   chunks: ['admin'],
    // }),
    new ExtractTextPlugin('[name].css?[hash]', {
      allChunks: false,
    }),


    new webpack.DefinePlugin({
      ENV: JSON.stringify(NODE_ENV),
    }),
  ],
};

if (NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new ProgressBarPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    }),
  ]);
} else {
  config.plugins = config.plugins.concat([
    new WebpackErrorNotificationPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
  ]);
}
module.exports = config;
