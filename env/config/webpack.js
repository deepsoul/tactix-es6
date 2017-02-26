"use strict";

var path = require('path');
var webpack = require('webpack');
var OptimizeJsPlugin = require("optimize-js-plugin");
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(entry, out) {
    return {
        entry: entry,
        // devtool: 'inline-eval-source-map',
        plugins: [
            new webpack.BannerPlugin('Agency Boilerplate'),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.ProvidePlugin({
                "$": "jquery",
                "jQuery": "jquery",
                "window.jQuery": "jquery",
                "root.jQuery": "jquery"
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: true
            }),
            new UglifyJsPlugin({
                screwIE8: true,
                mangle: {
                    // Skip mangling these
                    except: []
                },
                extractComments: true,
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
                    drop_console: true,
                    warnings: true
                }
            }),
            new OptimizeJsPlugin({
                sourceMap: false
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: "../reports/webpack/index.html",
                generateStatsFile: true,
                statsFilename: "../reports/webpack/stats.json",
                logLevel: "info"
            })
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /node_modules/,
                    loader: "jshint-loader"
                }, {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ],
                }, {
                    test: /\.hbs$/,
                    use: [
                        {
                            loader: "handlebars-loader",
                            options: {
                                helperDirs: [

                                ],
                                runtime: "handlebars/runtime",
                                partialDirs: [
                                    "<%= root %>/src/tmpl/partials"
                                ],
                                debug: false
                            }
                        }
                    ]
                }, {
                    test: /\.(p)?css$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, {
                            loader: "css-loader"
                        }, {
                            loader: "postcss-loader",
                            options: require(process.cwd() + '/env/config/postcss.js')
                        }
                    ]
                }, {
                    test: /\.(png|jpg|gif|svg|ttf|woff|eot)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 100000
                            }
                        }
                    ]
                }, {
                    test: /\.modernizr.js$/,
                    use: [
                        {
                            loader: 'imports-loader',
                            options: {
                                window: 'global'
                            }
                        },{
                            loader: 'modernizr-loader'
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: [
                path.resolve(process.cwd(), './src/js'),
                'node_modules'
            ],
            alias: {
                "jquery": "jquery/src/core.js",
                "modernizr$": process.cwd() + '/env/config/modernizr.js'
            }
        },
        output: out
    };
};
