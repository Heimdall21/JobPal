const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = {
    output: {
        path: path.join(__dirname, '/build')
    },
    entry: {
        'index': './src/index.tsx',
        'edit': './src/edit.tsx'
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["edit"],
            filename: 'edit.html',
            template: 'public/edit.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ["index"],
            filename: 'index.html',
            template: 'public/index.html'
        }),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: ""
            // You can pass any key-value pairs, this was just an example.
            // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                      loader: 'svg-url-loader',
                      options: {
                        limit: 10000,
                      },
                    },
                ],
            }
        ]
    }
};
