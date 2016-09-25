/**
 * yukino - Yukino is a music search crawler that is capable of downloading, identifying (with Gracenote) and serving up music from various web services.
 * It excels at making music accessible to all, using just Youtube and SndCloud
 */
var path = require('path');
var fs = require('fs');
var restify = require('restify');
// This is required
restify.CORS.ALLOW_HEADERS.push('auth');
var Application = (function () {
    function Application() {
        this._routes = [];
        console.log('Pricing server is starting up...');
        // Initialize the RESTify Express server...
        this.server = restify.createServer();
        this._registerMiddleware();
        // Prevents us from getting garbage collected
        this._routes = [];
        this._registerControllers();
        // Start server up on API port
        this.server.listen(2740, function () {
            console.log('API Server is now listening on port %d', 2740);
        });
    }
    Application.prototype._registerMiddleware = function () {
        this.server
            .use(restify.CORS({ headers: ['auth'], origins: ['*'] }))
            .use(restify.fullResponse())
            .use(restify.bodyParser())
            .use(restify.queryParser())
            .use(restify.authorizationParser());
        this.server.on('uncaughtException', function (req, res, route, err) {
            console.log(err.stack);
        });
    };
    Application.prototype._registerControllers = function () {
        // Setup all the routes using a recursive directory read and requiring all the routes; causing their callbacks to be triggered
        var normalizedPath = path.join(__dirname, "controllers");
        fs.readdirSync(normalizedPath).forEach(function (file) {
            var pathToRegister = "./controllers/" + file;
            var c = require(pathToRegister);
            var route = new c();
        });
    };
    return Application;
})();
var main = new Application();
