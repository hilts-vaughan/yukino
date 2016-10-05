import {DownloadReceipt} from "../model/DownloadReceipt";
import * as uuid from 'node-uuid'
import * as path from 'path'
const youtubedl = require('youtube-dl')


export class DownloadService {
  downloadVideoAudioToDisk(url: string): Promise<DownloadReceipt> {
    // These are the new keys for these services
    const key = uuid.v4();
    const newPath = path.join('/tmp', key)

    return new Promise<DownloadReceipt>((resolve, reject) => {
      youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', newPath + ".%(ext)s"], {}, function(err, output) {
        if (err) {
          reject(err)
        } else {
          const receipt = new DownloadReceipt(newPath + ".mp3")
          resolve(receipt)
        }
      });
    });
  }
}
