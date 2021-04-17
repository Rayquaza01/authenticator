/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: {
        background: __dirname + "/src/background.ts",
        popup: __dirname + "/src/pages/popup/popup.ts",
        options: __dirname + "/src/pages/options/options.ts",
        reset: __dirname + "/src/pages/reset/reset.ts"
    },
    devtool: "source-map",
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
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "src/pages/popup/popup.html",
            filename: "popup.html",
            chunks: ["popup"],
        }),
        new HtmlWebpackPlugin({
            template: "src/pages/options/options.html",
            filename: "options.html",
            chunks: ["options"],
        }),
        new HtmlWebpackPlugin({
            template: "src/pages/reset/reset.html",
            filename: "reset.html",
            chunks: ["reset"],
        }),
        new copyWebpackPlugin({
            patterns: [
                { from: "src/manifest.json" },
                {
                    from: "src/icons/",
                    to: "icons",
                    toType: "dir"
                }
            ]
        })
    ],
    externals: {
        "webextension-polyfill": "browser"
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    }
}
