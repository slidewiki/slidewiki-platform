let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        main: [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/only-dev-server',
            './client.js'
        ],
        vendor: [
            'react', 'react-dom', 'react-hotkeys', 'react-list', 'async', 'immutable', 'classnames', 'fluxible', 'fluxible-addons-react', 'fluxible-plugin-fetchr', 'fluxible-router'
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
            { test: /\.css$/, loaders: ['style-loader', 'css-loader']},
            // { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'url-loader?limit=100000' },

            //{ test: /\.css$/, loader: ExtractTextPlugin.extract("css") },
            //{ test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'url-loader?limit=100000' }
            { test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000'}

        ]
    },
    node: {
        setImmediate: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: '[name].bundle.js'
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        // For the css-loader, we need BROWSER set
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true)
            }
        }),
        // And an output CSS file to go into
        // new ExtractTextPlugin('styles.css')

    ],
    devtool: 'eval'
};

module.exports = webpackConfig;
