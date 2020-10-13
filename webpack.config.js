const path = require("path");
const webpack = require("webpack");
const OpenBrowserPlugin = require("open-browser-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    entry: "./src/main.js", // 项目打包入口
    output: {
        filename: "bundle.js", // 输出文件名
        path: path.resolve(__dirname, "dist") // 输出路径（需绝对路径
    },
    mode: "development", // 打包模式，可选"development"/"production"/"none"，自动根据选项来选用内部优化方案进行打包
    devServer: {
        port: 3000, // 端口号
        // contentBase: "public", // 入口HTML的目录（用了HtmlWebpackPlugin后可不需要
        // publicPath: "/dist", // 静态资源的访问目录， 注意斜杠左边没有点
        publicPath: "", // 用了HtmlWebpackPlugin后改成这样
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"] // 后执行的放前面
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                use: "file-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        esModule: false
                    }
                }
            }
        ]
    },
    plugins: [
        new OpenBrowserPlugin({url: "http://localhost:3000"}),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin()
    ]
}