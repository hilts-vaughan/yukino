import {SongFetchJob} from "../services/SongFetchJob";
import {JobDispatchService} from "../services/JobDispatchService";
import {IAPIController} from "../IAPIController";
import * as restify from 'restify'

export class MusicDownloadRequestController implements IAPIController {
  private _jobService: JobDispatchService;

  constructor() {
    // TODO: Send the proper queue into here
    this._jobService = new JobDispatchService();
  }

  registerWithServer(server: restify.Server) {
    server.post('/download', (request: restify.Request, response: restify.Response, next: restify.Next) => {
      var body = request.params || {};
      if (!body.url) {
        return response.send(400, 'Missing parameter `url`');
      } else if (!body.token) {
        return response.send(400, 'Missing paramter `token`')
      } else if (this.hasUserExceededRequestLimits()) {
        return response.send(429, 'You have exceeded your amount of downloads at once.')
      }

      // Process the actual job since the user seems to be within acceptable
      // bounds to perform this operation
      const fetchJob = new SongFetchJob(body.url, body.token);
      this._jobService.dispatchJob(fetchJob).then((jobResult) => {
        this._persistJob(fetchJob, jobResult)
      })
        .catch((error) => {
          this._persistJob(fetchJob, null)
        });
    })
  }

  private _persistJob(job: SongFetchJob, jobResult: any) {
    if (jobResult) {

    } else {
      console.log('Failed to complete the job ')
    }
  }

  hasUserExceededRequestLimits(): boolean {
    // Specifies the amount of jobs one IP address can possibly hold onto
    // and have queued at any given time.
    const MAX_JOBS_PER_IP = 2;

    // TODO: Check the amount of jobs in the queue for this user at this
    // moment... we can do this with the job manager.

    return false;
  }

  getUserLockToken(req: restify.Request) {
    // Check here... we should also make sure the user does not have many jobs
    // queued into the queue, otherwise we'll reject them...
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

}
