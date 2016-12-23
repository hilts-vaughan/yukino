/**
 * A single result that is returned from the search provider.
 */
export class SongSearchResult {
  private _url: string;
  private _title: string;
  private _image: string;

  constructor(url: string, title: string) {
    this._url = url;
    this._title = title;

    // The client will expect an image resource URL as well, so we can go
    // ahead and ask for this...
    if (url) {
      console.log(url)
      var videoId = url.match("\g\?v.*")[0].substring(2)
      this._image = `https://img.youtube.com/vi/${videoId}/0.jpg`
    }
  }

  get url() {
    return this._url
  }

  get title() {
    return this._url;
  }
}
