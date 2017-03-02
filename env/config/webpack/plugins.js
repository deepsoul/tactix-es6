"use strict";

var webpack = require('webpack');
var OptimizeJsPlugin = require("optimize-js-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
    {
        development: true,
        production: true,
        config: new webpack.BannerPlugin('Agency Boilerplate')
    }, {
        development: true,
        production: true,
        config: new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    }, {
        development: true,
        production: true,
        config: new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            "root.jQuery": "jquery"
        }),
    }, {
        development: true,
        production: true,
        config: new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
    }, {
        development: false,
        production: true,
        config: new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            screwIE8: true,
            mangle: {
                except: []
            },
            extractComments: true,
            acorn: true,
            compress: {
                sequences: true,
                properties: true,
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                hoist_vars: false,
                if_return: true,
                join_vars: true,
                cascade: true,
                negate_iife: true,
                pure_getters: false,
                drop_console: false,
                warnings: true
            }
        }),
    }, {
        development: false,
        production: true,
        config: new OptimizeJsPlugin({
            sourceMap: false
        }),
    }, {
        development: false,
        production: true,
        config: new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "../reports/webpack/index.html",
            generateStatsFile: true,
            statsFilename: "../reports/webpack/stats.json",
            logLevel: "info"
        })
    }, {
        development: true,
        production: false,
        config: new webpack.HotModuleReplacementPlugin()
    }, {
        development: true,
        production: false,
        config: new webpack.NoEmitOnErrorsPlugin()
    }
];
