import {IJob} from "./IJob";
export class SongFetchJob implements IJob {
  private _url: string;
  private _deliverTo: string;

  constructor(url: string, token: string) {
    this._url = url;
    this._deliverTo = token;
  }

  static getJobKey(): string {
    return 'SongFetchJob';
  }

  getJobRequestState(): any {
    return {
      url: this._url,
      token: this._deliverTo
    }
  }

}
