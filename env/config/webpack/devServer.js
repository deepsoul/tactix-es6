"use strict";

module.exports = {
    production: function() {
        return {};
    },
    development: function(server) {
        if(server) {
            return {
                // contentBase: 'http://' + server.host + ':' + server.port + '/',
                contentBase: process.cwd(),
                compress: true,
                filename: null, // Get from output.filename
                historyApiFallback: false,
                host: server.host,
                port: server.port, // 0 = Randomly selected
                hot: true,
                https: false,
                inline: true,
                lazy: false,
                noInfo: false,
                outputPath: 'http://' + server.host + ':' + server.port + '/' + server.path + '/',
                publicPath: null, // Get from output.publicPath
                proxy: {},
                quiet: false,
                stats: {
                    cached: false,
                    cachedAssets: false
                    // colors: true or false, turned on if the terminal supports it
                }
            };
        } else {
            return {};
        }
    }
};
