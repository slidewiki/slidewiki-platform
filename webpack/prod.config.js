let webpack = require('webpack');

let path = require('path');
let StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
let Visualizer = require('webpack-visualizer-plugin');

let webpackConfig = {
    resolve: {
        extensions: ['', '.js']
    },
    entry: {
        main: [
            './client.js'
        ],
        vendor: [
            'react', 'react-dom', 'react-hotkeys', 'react-list', 'async', 'immutable', 'classnames', 'fluxible', 'fluxible-addons-react', 'fluxible-plugin-fetchr', 'fluxible-router', 'react-google-recaptcha', 'react-modal'
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
                exclude: /node_modules\/(react-google-recaptcha|react-custom-scrollbars)/,
                loaders: [
                    require.resolve('babel-loader')
                ]
            },
            { test: /\.json$/, loader: 'json-loader'},
        ]
    },
    node: {
        setImmediate: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),                
                BROWSER: JSON.stringify(true),

            }
        }),

        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: '[name].bundle.js'
        }),
        // Write out stats file to build directory.
        new StatsWriterPlugin({
            filename: 'webpack.stats.json', // Default
            fields: null,
            transform: function (data) {
                return JSON.stringify(data, null, 2);
            }
        }),
        new Visualizer()
    ],
    devtool: 'source-map'
};

module.exports = webpackConfig;
