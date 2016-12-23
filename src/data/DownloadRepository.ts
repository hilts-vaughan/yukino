import {SongRequest} from "../model/SongRequest";

export class DownloadRepository {
  // cache is static so we can just have a central access point
  // .. we can always serve it outside of here if we need to
  private static _cache: Object = {};
  private static _cacheById: Object = {}

  addDownloadToCache(request: SongRequest) {
    DownloadRepository._cache[request.getUrl()] = request;
    DownloadRepository._cacheById[request.id] = request
  }

  getDownloadForUrl(url: string): SongRequest {
    return DownloadRepository._cache[url];
  }

  getDownloadById(id: number): SongRequest {
    return DownloadRepository._cacheById[id];
  }

}
