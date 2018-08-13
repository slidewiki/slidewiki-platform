let webpack = require('webpack');
let path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    name: 'settings',
    entry: './configs/settings',
    output: {
        filename: 'settings.js',
        path: path.resolve('./build/js'),
        publicPath: '/public/js/',
        library: 'SlideWikiSettings',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules\/(?!identicons)/ ,
                loader: 'babel-loader'
            },
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        })
    ],
};
