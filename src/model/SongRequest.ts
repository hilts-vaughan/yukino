import {SongMetadata} from "./SongMetadata";
export class SongRequest {
  private _pathOnDisk: string;
  private _originalUrl: string;
  private _meta: SongMetadata;

  private static _idCounter: number = 4985;
  private _id: number = SongRequest._idCounter++;

  constructor(originalUrl: string, pathOnDisk: string, discoveredMetaData: SongMetadata) {
    this._pathOnDisk = pathOnDisk;
    this._originalUrl = originalUrl;
    this._meta = discoveredMetaData;
  }

  get path(): string {
    return this._pathOnDisk;
  }

  get metadata(): SongMetadata {
    return this._meta;
  }

  getUrl(): string {
    return this._originalUrl;
  }

  get id(): number {
    return this._id;
  }

}
