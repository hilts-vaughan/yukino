import {SongSearchResult} from "../services/search/SongSearchResult";
import {YoutubeSearchProvider} from "../services/search/YoutubeSearchProvider";
import {MusicSearchService} from "../services/MusicSearchService";
import {IAPIController} from "../IAPIController";
import * as restify from 'restify'
import * as config from 'config'

/**
 * This is a service that allows you to search for various music services
 * that are provided.
 */
export class MusicSearchController implements IAPIController {
  private _searchService: MusicSearchService;

  constructor() {
    this._searchService = new MusicSearchService()
    const apiKey: string = config.get<string>('youtube.key');
    this._searchService.registerProvider(new YoutubeSearchProvider(apiKey))
  }

  registerWithServer(server: restify.Server) {
    // Register API points
    server.get('/search', this.onSearchGet.bind(this));
  }

  private onSearchGet(request: restify.Request, response: restify.Response, next: restify.Next) {
    var body = request.params || {};

    if (!body.q) {
      return response.send(400, 'Missing parameter `q`');
    }

    this._searchService.search(body.q).then((results: Array<SongSearchResult>) => {
      response.send(200, results);
    }).catch((reason) => {
      response.send(500, reason);
    });
  }

}
