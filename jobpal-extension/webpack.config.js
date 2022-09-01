const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    devServer: {
        static: {
          directory: path.resolve(__dirname, './src'),
        },
        historyApiFallback: true
    },
    entry: {
        index: path.resolve(__dirname, "./src/index.tsx"),
        content: path.resolve(__dirname, "./public/content.js"),
        input: path.resolve(__dirname, "./src/ContentScripts/input.ts"),
        background: path.resolve(__dirname, "./public/background.js"),
        listener: path.resolve(__dirname, "./src/ContentScripts/listener.ts")
        // options: path.resolve(__dirname, "./src/index-options.js"),
        // foreground: path.resolve(__dirname, "./src/index-foreground.js")
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: 'svg-url-loader',
                  options: {
                    limit: 10000,
                  },
                },
              ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            chunks: ['index']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/manifest.json', to: '[name][ext]' },
                // { from: 'src/background.js', to: '[name].[ext]' },
                // { from: 'src/inject_script.js', to: '[name].[ext]' },
                { from: 'public/*.png', to: '[name][ext]' }
            ]
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
}