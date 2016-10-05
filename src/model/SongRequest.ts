import {SongMetadata} from "./SongMetadata";
export class SongRequest {
  private _pathOnDisk: string;
  private _orinalUrl: string;
  private _meta: SongMetadata;

  constructor(originalUrl: string, pathOnDisk: string, discoveredMetaData: SongMetadata) {
    this._pathOnDisk = pathOnDisk;
    this._orinalUrl = originalUrl;
    this._meta = discoveredMetaData;

    // do something with the metadata maybe...
  }
}
