import {SongSearchResult} from "./SongSearchResult";
import * as config from 'config'
const search = require('youtube-search')
import * as _ from 'lodash'

export class YoutubeSearchProvider implements ISongSearchProvider {
  private _options: any;

  constructor(apiKey: string) {
    this._options = {
      key: apiKey
    };
  }
  search(query: string, resultCount = 10): Promise<Array<SongSearchResult>> {
    var options: any = _.extend({ maxResults: resultCount, type: 'video' }, this._options)
    var result = new Promise((resolve, reject) => {
      search(query, options, (err, results) => {
        if (err) {
          reject();
          console.log(err);
          return;
        }

        var searchItems: Array<any> = results;
        var songSearchResult: Array<SongSearchResult> = [];
        searchItems.forEach((searchItem: any) => {
          const videoId = searchItem.link;
          const videoTitle = searchItem.title;
          var songResult = new SongSearchResult(videoId, videoTitle);
          songSearchResult.push(songResult);
        })

        // Return the youtube search items... because awesome :)
        resolve(songSearchResult);
      })
    })
    return result;
  }
}
