import {SongFetchJobHandler} from "./handlers/SongFetchJobHandler";
import * as kue from 'kue'
import * as config from 'config'

export class ComputeWorker {
  private _id: number;
  private _priority: number;
  private _queue: kue.Queue;

  constructor(id: number, priority: number, queue: kue.Queue) {
    this._id = id;
    this._priority = priority;
    this._queue = queue;
  }

  listen() {
    const handler = new SongFetchJobHandler()
    this._queue.process('download', 5, (job: kue.Job, done: Function) => {
      // Dispatch to the handler and then signal Kue
      handler.handleRequest(job.data).then((result) => {
        done(null, result);
      }).catch((reason) => {
        done(reason, null);
      })
    })
  }
}
