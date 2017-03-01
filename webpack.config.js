// import webpack from 'webpack';
const webpack = require('webpack');
const path = require('path');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname, // string (absolute path!)
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, "dist"), // string
        filename: 'bundle.js',
        // publicPath: '/static/'
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true,
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.BROWSER': true
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.styl$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'stylus-loader'}]
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico|ttf|otf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
                use: 'file-loader?name=[path][name].[ext]'
                // use: 'file-loader'
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
        ]
    },
    
    // resolve: {
    //     modules: ['node_modules'],
    //     extensions: ['.js', '.jsx', '.json'],
    //     alias: {}
    // }
};


