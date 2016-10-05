import {SongMetadata} from "../model/SongMetadata";
import {DownloadReceipt} from "../model/DownloadReceipt";
import {IMetadataResolverStrategy} from "./IMetadataResolverStrategy";
import * as _ from 'lodash'

export class MetadataResolver {
  private _resolvers: Array<IMetadataResolverStrategy> = []

  public registerResolver(resolver: IMetadataResolverStrategy) {
    this._resolvers.push(resolver);
  }

  public resolveForReceipt(receipt: DownloadReceipt): Promise<SongMetadata> {
    const streamFilename = receipt.streamForFile
    const promises = _.map(this._resolvers, (resolver) => resolver.resolve(receipt))
    return new Promise<SongMetadata>((resolve, reject) => {
      Promise.all(promises).then((values) => {
        // Collect the highest confidence value
        const bestFit = _.maxBy(values, (value) => value.confidence)
        resolve(bestFit)
      }).catch((error) => reject(error))
    })
  }
}
