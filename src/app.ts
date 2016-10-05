import {ComputeWorker} from "./compute/ComputeWorker";
/**
 * yukino - Yukino is a music search crawler that is capable of downloading, identifying (with Gracenote) and serving up music from various web services.
 * It excels at making music accessible to all, using just Youtube and SndCloud
 */

import { IAPIController } from "./IAPIController";
import * as path from 'path';
import * as fs from 'fs';
import * as restify from 'restify';
import * as cluster from 'cluster'
import * as kue from 'kue'
import * as config from 'config'
import * as os from 'os'


// This is required
restify.CORS.ALLOW_HEADERS.push('auth');

class Application {
  private server: restify.Server;
  private _routes: Array<any> = [];

  constructor() {
    console.log('yukino - core is booting...');

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

    console.log('kue - bootstraping & now accepting workers...');

    // Accept Kue workers where possible
    const port: number = config.get<number>('kue.port')
    kue.app.listen(port)
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
          let route: IAPIController = new c[key]()
          route.registerWithServer(this.server)
        }
      }
    });
  }

}


// Begin the master server if it's master
if (cluster.isMaster) {
  var main = new Application()

  // We'll spin up a compute node for each core
  // since the API is fairly light and can handle under load.
  // In most circumstances, compute nodes would be seperate, though
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
}
