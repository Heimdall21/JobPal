const path = require('path');
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
        content: path.resolve(__dirname, "./public/content.tsx"),
        background: path.resolve(__dirname, "./public/background.ts"),
        listener: path.resolve(__dirname, "./src/ContentScripts/listener.ts"),
        edit: path.resolve(__dirname, "./src/edit.tsx")
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
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/manifest.json', to: '[name][ext]' },
                { from: 'public/*.png', to: '[name][ext]' },
                { from: 'public/edit.html', to: 'edit.html'}
            ]
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
}