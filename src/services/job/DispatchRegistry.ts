import {IJobHandler} from "./IJobHandler";
import * as kue from 'kue'

export class DispatchRegistry {
  private _queue: kue.Queue;
  private readonly _registryMap = new Map<String, IJobHandler>()

  constructor(queue: kue.Queue) {
    this._queue = queue;
  }

  registerHandlerForJobType(jobKey: string, handler: IJobHandler) {
    this._registryMap.set(jobKey, handler);
    console.log('Registered a job handler for %s with handler!', jobKey)
  }

  removeHandlersForJobType(jobKey: string) {
    this._registryMap.delete(jobKey);
  }
}
