/**
 * A single result that is returned from the search provider.
 */
export class SongSearchResult {
  private _url: string;
  private _title: string;

  constructor(url: string, title: string) {
    this._url = url;
    this._title = title;
  }

  get url() {
    return this._url
  }
  get title() {
    return this._url;
  }
}
