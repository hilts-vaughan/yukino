export class SongMetadata {
  private _title: string;
  private _artist: string;
  private _album: string;
  private _score: number;

  constructor(title: string, artist: string, album: string, confidence: number) {
    this._title = title;
    this._artist = artist;
    this._album = album;
    this._score = confidence;
  }

  get title() {
    return this._title;
  }

  get artist() {
    return this._artist;
  }

  get album() {
    return this._album;
  }

  get confidence() {
    return this._score;
  }

  static emptyMetadata() {
    return new SongMetadata("", "", "", 0);
  }

}
