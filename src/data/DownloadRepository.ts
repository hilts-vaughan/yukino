import {SongRequest} from "../model/SongRequest";

export class DownloadRepository {
  // cache is static so we can just have a central access point
  // .. we can always serve it outside of here if we need to
  private static _cache: Object = {};

  addDownloadToCache(request: SongRequest) {
    DownloadRepository._cache[request.getUrl()] = request;
  }

  getDownloadForUrl(url: string): SongRequest {
    return DownloadRepository._cache[url];
  }
}
