const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: { injectType: 'styleTag' },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(ttf|otf|ttc|png|svg|jpg|gif)$/,
                use: ["url-loader?limit=100000"],
            },
            {
                test: /\.babylon$/,
                use: [
                    {
                        loader: 'babylon-file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};