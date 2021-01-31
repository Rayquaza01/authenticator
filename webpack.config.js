const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        background: __dirname + "/src/background.ts",
        popup: __dirname + "/src/popup.ts",
        options: __dirname + "/src/options.ts"
    },
    // devtool: "source-map",
    devtool: "eval-source-map",
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
    },
    plugins: [
        new CleanWebpackPlugin(),
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
    optimization: {
        usedExports: true
    //     splitChunks: {
    //         chunks: "all"
    //     }
    }
}
