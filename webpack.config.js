const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: {
        background: __dirname + "/src/background.ts",
        popup: __dirname + "/src/ui/popup/index.ts",
        options: __dirname + "/src/ui/options/index.ts"
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
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
        fallback: {
            buffer: require.resolve("buffer/"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify")
        }
    },
    optimization: {
        nodeEnv: "production",
        usedExports: true
    //     splitChunks: {
    //         chunks: "all"
    //     }
    }
}
