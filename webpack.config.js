let webpack = require('webpack');
let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loaders = require('./webpack.config.loaders')();
let path = require('path');

loaders.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    })
});

module.exports = {
    entry: {
        main: './src/index.js',
        friendFilter: './src/friendFilter.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: {
        loaders
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         drop_debugger: false
        //     }
        // }),
        new ExtractTextPlugin('styles.css'),
        new HtmlPlugin({
            title: 'Main Homework',
            template: 'index.hbs',
            chunks: ['main']
        }),
        new HtmlPlugin({
            title: 'friendsFilter_VK',
            template: 'friendFilter.hbs',
            filename: 'friendFilter.html',
            chunks: ['friendFilter']
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};
