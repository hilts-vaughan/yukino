export class DownloadReceipt {
  private _path: string;

  constructor(path: string) {
    this._path = path;
  }

  get streamForFile(): string {
    return this._path;
  }

}
