'use strict';
const path = require('path');
const webpack = require('webpack');

let common_config = {
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'honor.js',
        path: path.join(__dirname, 'dist'),
        library: 'honor',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(.*)?$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve('tsconfig.webpack.json'),
                    compilerOptions: {
                        target: 'es5',
                    },
                    transpileOnly: true,
                },
            },
        ],
    },
};

const dev_config = {
    devtool: 'eval-source-map',
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, './'),
        hot: true,
        host: '0.0.0.0',
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
};

const prod_ts_compile_option = {
    target: 'es5',
    sourceMap: false,
    lib: ['dom', 'es5', 'es2015.promise'],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        return Object.assign(common_config, dev_config);
    } else {
        common_config.module.rules[0].options.compilerOptions = prod_ts_compile_option;
        return common_config;
    }
};
