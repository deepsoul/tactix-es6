"use strict";

var path = require('path');
var devtool = {
    development: 'source-map',
    production: 'cheap-source-map'
};

module.exports = {
    devtool: devtool[process.env.NODE_ENV],
    plugins: require('./webpack/plugins').reduce(reduceList, []),
    module: {
        rules: require('./webpack/loaders').reduce(reduceList, [])
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
    }
};

function reduceList(result, item) {
    if(item[process.env.NODE_ENV]) {
        result.push(item.config);
    }
    return result;
}
