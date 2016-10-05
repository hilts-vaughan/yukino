import {SongMetadata} from "../model/SongMetadata";
const id3 = require('id3-writer');

export class MetadataWriter {
  private readonly _writer : any;

  constructor() {
    this._writer = new id3.Writer();
  }

  writeMetadataToFile(file: string, metadata: SongMetadata): Promise<SongMetadata> {
    return new Promise<SongMetadata>((resolve, reject) => {
      return resolve(metadata);

      const fileHandler = new id3.File(file);
      var meta = new id3.Meta({
        artist: metadata.artist,
        title: metadata.title,
        album: metadata.album
      });

      this._writer.setFile(fileHandler).write(meta, (err) => {
        console.log(err)
        if (err) {
          throw err;
        } else {
          resolve(metadata);
        }
      });
    })
  }
}
