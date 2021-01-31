const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: {
        background: __dirname + "/src/background.ts",
        popup: __dirname + "/src/ui/popup/index.ts",
        options: __dirname + "/src/ui/options/index.ts"
    },
    devtool: "eval-cheap-source-map",
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
        fallback: {
            buffer: require.resolve("buffer/"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify")
        },
        alias: {
            process: "process/browser.js"
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            process: "process/browser.js",
            Buffer: ["buffer", "Buffer"]
        }),
        new HtmlWebpackPlugin({
            template: "src/popup.html",
            filename: "popup.html",
            chunks: ["popup"],
            cache: false
        }),
        new HtmlWebpackPlugin({
            template: "src/options.html",
            filename: "options.html",
            chunks: ["options"],
            cache: false
        })
    ],
    optimization: {
        usedExports: true
    //     splitChunks: {
    //         chunks: "all"
    //     }
    }
}
