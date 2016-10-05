import {DownloadReceipt} from "../model/DownloadReceipt";

// TODO: http://data.acoustid.org/fullexport/2016-04-01/
// It'd be good to use this database to create our own fully automated
// local version of it to avoid the rate limiting...
export interface IMetadataResolverStrategy {
  resolve(receipt: DownloadReceipt): Promise<SongMetadata>;
  isSupportedForReceipt(receipt: DownloadReceipt): boolean;
}
