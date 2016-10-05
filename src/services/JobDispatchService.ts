import {IJobHandler} from "./job/IJobHandler";
import {DispatchRegistry} from "./job/DispatchRegistry";
import {IJob} from "./IJob";
import * as kue from 'kue'

/*
  Dispatches job to a queue given their requirements. Works at a more abstract
  level than the implementation so that jobs can be dispatched and their
  results stored into a DB for consumption later.
 */
export class JobDispatchService {
  private _queue: kue.Queue;
  private _registry: DispatchRegistry;

  constructor() {
    this._queue = kue.createQueue({})
    this._registry = new DispatchRegistry(this._queue);
  }

  addJobHandler(jobKey: string, handler: IJobHandler) {
    this._registry.registerHandlerForJobType(jobKey, handler);
    this._queue.process(jobKey, 5, (job: kue.Job, done: Function) => {
      handler.handleRequest(job.data).then((result) => {
        done(null, result)
      }).catch((error) => {
        done(error);
      })
    })
  }

  dispatchJob(job: IJob): Promise<any> {
    const state = job.getJobRequestState();
    const kueJob = this._queue.createJob(job.getJobKey(), job.getJobRequestState()).save();
    return new Promise<any>((resolve, reject) => {
      kueJob.once('complete', (result: any) => {
        resolve(result)
      })
      kueJob.once('error', (fail) => {
        console.log('Job failed w/ ' + fail);
        reject(fail);
      });
    });
  }

  numberOfPendingJobsOfTypeForInitiator(jobKey: string, initiatorToken: string): number {
    throw new Error('This is not implemented yet.');
  }

}
