import {SongMetadata} from "../model/SongMetadata";
const nodeID3 = require('node-id3');


export class MetadataWriter {
  writeMetadataToFile(file: string, metadata: SongMetadata): Promise<SongMetadata> {
    return new Promise<SongMetadata>((resolve, reject) => {
      // TODO: Find a way to make this resolver work

      var meta = {
        artist: metadata.artist,
        title: metadata.title,
        album: metadata.album,
        encodedBy: 'yukino'
      };

      console.log(meta)
      var success = nodeID3.write(meta, file)
      console.log(success)

      if (!success) {
        throw new Error('Failed to fetch write meta!');
      } else {
        resolve(metadata)
      }

    })
  }
}
