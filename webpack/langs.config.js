let path = require('path');
let ReactIntlPlugin = require('react-intl-webpack-plugin');

let webpackConfig = {

    entry: {
        main: './client.js',
    },

    output: {
        path: path.resolve(__dirname, '../build/messages/'),
        filename: 'main.js',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                loader: 'null-loader',
            },
        ],
    },

    plugins: [
        // collect all messages into one json (?)
        new ReactIntlPlugin(),
    ],

};

module.exports = webpackConfig;
