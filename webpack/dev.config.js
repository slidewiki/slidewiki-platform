let webpack = require('webpack');
let path = require('path');

let webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './client.js'
    ],
    output: {
        path: path.resolve('./build/js'),
        publicPath: '/public/js/',
        filename: 'main.js'
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
            { test: /\.css$/, loader: 'style-loader!css-loader'},
            // Getting URLs for font files otherwise we get encoding errors in css-loader
            { test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000'}
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
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                BROWSER: JSON.stringify(true)
            }
        })
    ],
    devtool: 'eval'
};

module.exports = webpackConfig;
