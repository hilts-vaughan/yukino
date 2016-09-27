/**
 * yukino - Yukino is a music search crawler that is capable of downloading, identifying (with Gracenote) and serving up music from various web services.
 * It excels at making music accessible to all, using just Youtube and SndCloud
 */

import { IAPIController } from "./IAPIController";
import * as path from 'path';
import * as fs from 'fs';
import * as restify from 'restify';

// This is required
restify.CORS.ALLOW_HEADERS.push('auth');

class Application {
  private server: restify.Server;
  private _routes: Array<any> = [];

  constructor() {
    console.log('Pricing server is starting up...');

    // Initialize the RESTify Express server...
    this.server = restify.createServer();

    this._registerMiddleware();

    // Prevents us from getting garbage collected
    this._routes = [];
    this._registerControllers();

    // Start server up on API port
    this.server.listen(2740, () => {
      console.log('API Server is now listening on port %d', 2740);
    })
  }

  _registerMiddleware() {
    this.server
      .use(restify.CORS({ headers: ['auth'], origins: ['*'] }))
      .use(restify.fullResponse())
      .use(restify.bodyParser())
      .use(restify.queryParser())
      .use(restify.authorizationParser());

    this.server.on('uncaughtException', function(req, res, route, err) {
      console.log(err.stack);
    });

  }

  _registerControllers() {
    // Setup all the routes using a recursive directory read and requiring all the routes; causing their callbacks to be triggered
    let normalizedPath = path.join(__dirname, "controllers");
    fs.readdirSync(normalizedPath).forEach((file) => {
      if (file.endsWith(".js")) {
        let pathToRegister = "./controllers/" + file
        let c = require(pathToRegister);
        for (const key in c) {
          console.log(key)
          let route: IAPIController = new c[key]()
          console.log(route)
          route.registerWithServer(this.server)
        }
      }
    });
  }

}

var main = new Application()
