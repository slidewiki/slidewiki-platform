'use strict';
let webpack = require('webpack');
let path = require('path');
const host = process.env.HOST || '0.0.0.0';
const port = (process.env.PORT + 1) || 3001;

let webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        main: [
            //todo: solve the issue with same-origin policy when loading fonts
            'webpack-dev-server/client?http://' + host + ':3000',
            'webpack/hot/only-dev-server',
            './client.js'
        ]
    },
    output: {
        path: path.resolve('./build/js'),
        publicPath: '/public/js/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    require.resolve('react-hot-loader'),
                    require.resolve('babel-loader')
                ]
            },
            { test: /\.json$/, loader: 'json-loader'},
            // Getting URLs for font files otherwise we get encoding errors in css-loader
            { test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000'},
            { test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    },
    node: {
        setImmediate: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev'),
                BROWSER: JSON.stringify(true)
            }
        }),

    ],
    devtool: 'eval'
};

module.exports = webpackConfig;
