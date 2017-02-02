let webpack = require('webpack');
let path = require('path');
const host = process.env.HOST || '0.0.0.0';
const port = (process.env.PORT + 1) || 3001;

let webpackConfig = {
    resolve: {
        extensions: ['.js', '.jsx']
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
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'react-hot-loader'
                    },
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            { test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            // Getting URLs for font files otherwise we get encoding errors in css-loader
            { test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000'},
        ]
    },
    node: {
        setImmediate: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
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
