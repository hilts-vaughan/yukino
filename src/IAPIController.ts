import * as restify from 'restify'

export interface IAPIController {
  registerWithServer(server: restify.Server);
}
