import {SongSearchResult} from "./search/SongSearchResult";
import * as _ from 'lodash'

export class MusicSearchService {
  private _searchProviders: Array<ISongSearchProvider> = []

  registerProvider(provider: ISongSearchProvider) {
    this._searchProviders.push(provider)
  }

  search(query: string): Promise<Array<SongSearchResult>> {
    return new Promise((resolve, reject) => {

      if (this._searchProviders.length === 0) {
        reject('There are no search providers registered.')
      }

      const promises: Array<Promise<Array<SongSearchResult>>> = []
      this._searchProviders.forEach((provider) => {
        var promise = provider.search(query);
        promises.push(promise);
      })

      // TODO: The promise would reject because one of them failed...?
      // We should fix this to let any of them work and then resolve or whatever
      // may want to use Promise.any to get around this...
      // http://www.effectiveui.com/blog/2014/11/11/promise-any-a-missing-use-case/
      Promise.all(promises).then((values: Array<Array<SongSearchResult>>) => {
        resolve(_.flattenDeep(values));
      }).catch((err) => {
        console.log('... ' + err)
        reject();
      });
    })
  }

}
