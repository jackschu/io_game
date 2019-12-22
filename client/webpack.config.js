const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: './src/client.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'io-game',
            template: './src/index.html',
            inject: 'body',
        }),
        new FaviconsWebpackPlugin('./res/favicon.png'),
    ],
};
