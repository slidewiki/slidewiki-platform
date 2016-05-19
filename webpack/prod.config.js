let webpack = require('webpack');
let path = require('path');

let webpackConfig = {
    resolve: {
        extensions: ['', '.js']
    },
    entry: {
        main: [
            './client.js'
        ],
        vendor: [
            'react', 'react-dom', 'react-hotkeys', 'react-list', 'async', 'immutable', 'classnames', 'fluxible', 'fluxible-addons-react', 'fluxible-plugin-fetchr', 'fluxible-router'
        ]
    },
    output: {
        path: path.resolve('./build/js'),
        publicPath: '/public/js/',
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    require.resolve('babel-loader')
                ]
            },
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },
    node: {
        setImmediate: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
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
            filename: 'vendor.bundle.js'
        })
    ],
    devtool: 'source-map'
};

module.exports = webpackConfig;
