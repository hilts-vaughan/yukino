// node module imports
const acoustid = require("acoustid");

import {DownloadReceipt} from "../../model/DownloadReceipt";
import {IMetadataResolverStrategy} from "../IMetadataResolverStrategy";
import {SongMetadata} from '../../model/SongMetadata';

export class MusicBrainzResolver implements IMetadataResolverStrategy {
  private _key: string;

  constructor(apiKey: string) {
    this._key = apiKey;
  }

  resolve(receipt: DownloadReceipt): Promise<SongMetadata> {
    return new Promise<SongMetadata>((resolve, reject) => {
      acoustid(receipt.streamForFile, { key: this._key }, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          if (results.length === 0) {
            return resolve(SongMetadata.emptyMetadata())
          }

          // Extract the meta data here and then return it into the SongMetadata
          const artist = results[0].recordings[0].artists[0].name;
          const album = results[0].recordings[0].releasegroups[0].title;
          const name = results[0].recordings[0].title;
          const score = results[0].score;

          return resolve(new SongMetadata(name, artist, album, score));
        }
      });
    })
  }

  isSupportedForReceipt(receipt: DownloadReceipt): boolean {
    // We can always rely on our musicbrainz resolver :)
    return true;
  }

}
