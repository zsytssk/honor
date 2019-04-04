'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;

module.exports = {
    mode: 'development',

    context: `${__dirname}/src/`,

    entry: {
        honor: './Honor.js'
    },

    output: {
        path: `D:\\Projects\\legend_demo\\bin\\libs`,
        // path: `${__dirname}/dist/`,
        // path:`${__dirname}/example/test_new_framwork/libs`,
        filename: '[name].js',
        library: 'Honor',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            }
        ]
    },
    // module: {
    //     loaders: [
    //         {
    //             test: /\.json$/,
    //             loader: "json"
    //         },
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
    //             query: {
    //                 presets: ['latest']
    //             }
    //         }
    //     ]
    // },

    performance: { hints: false },

    // plugins: [
    //     new webpack.DefinePlugin({
    //         "typeof CANVAS_RENDERER": JSON.stringify(true),
    //         "typeof WEBGL_RENDERER": JSON.stringify(true),
    //         "typeof EXPERIMENTAL": JSON.stringify(true),
    //         "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
    //         "typeof PLUGIN_FBINSTANT": JSON.stringify(false)
    //     }),
    //     {
    //         apply: (compiler) => {
    //             compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
    //                 exec('node scripts/copy-to-examples.js', (err, stdout, stderr) => {
    //                     if (stdout) process.stdout.write(stdout);
    //                     if (stderr) process.stderr.write(stderr);
    //                 });
    //             });
    //         }
    //     }
    // ],

    devtool: 'source-map'
};