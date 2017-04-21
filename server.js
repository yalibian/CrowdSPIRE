"use strict";

const Webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require("./webpack.config");

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true
    },
    setup: function(app) {
        app.use(function(req, res, next) {
            // console.log(`Using middleware for ${req.url}`);
            next();
        });
    }
});

server.listen(8080, "127.0.0.1", function() {
    console.log("CrowdSPIRE on http://localhost:6666");
});
