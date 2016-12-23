import {MetadataWriter} from "../MetadataWriter";
import * as config from 'config'
import * as fs from 'fs'
import {MusicBrainzResolver} from "../resolvers/MusicBrainzResolver";
import {MetadataResolver} from "../MetadataResolver";
import {DownloadReceipt} from "../../model/DownloadReceipt";
import {DownloadService} from "../DownloadService";
import {SongRequest} from "../../model/SongRequest";

export class SongFetchJobHandler {
  private _downloadService: DownloadService;
  private _metadataResolver: MetadataResolver;
  private _metadataWriter: MetadataWriter;

  constructor() {
    this._downloadService = new DownloadService()
    this._metadataResolver = new MetadataResolver()
    this._metadataWriter = new MetadataWriter()

    const musicBrainzApiKey = config.get<string>('resolvers.musicbrainz.key')
    this._metadataResolver.registerResolver(new MusicBrainzResolver(musicBrainzApiKey))
  }

  handleRequest(data: any): Promise<SongRequest> {
    let resourcePath: string = null;

    console.log('Now handling a song request job...')

    return new Promise<SongRequest>((resolve, reject) => {
      const url = data.url;
      this._downloadService.downloadVideoAudioToDisk(url).then((download: DownloadReceipt) => {
        return this._metadataResolver.resolveForReceipt(download).then((metadata) => {
          resourcePath = download.streamForFile;
          this._metadataWriter.writeMetadataToFile(download.streamForFile, metadata).then((value) => {
            const request = new SongRequest(url, download.streamForFile, metadata);
            console.log("File has been successfully downloaded and stored @ %s", download.streamForFile)
            resolve(request);
          })
        })
      }).catch((reason) => {
        console.log(reason);

        // Cleanup the temp file if something went wrong so that
        // disk space isn't consumed for no reason... we won't wait here
        // because there's no real reason to care if it failed or not
        fs.unlink(resourcePath)

        // Reject the promise because it's clear it was a failure
        reject(reason);
      })
    })
  }

}
