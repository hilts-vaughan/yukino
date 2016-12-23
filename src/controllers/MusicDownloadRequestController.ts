import {SongFetchJobHandler} from "../compute/handlers/SongFetchJobHandler";
import {DownloadRepository} from "../data/DownloadRepository";
import {SongRequest} from "../model/SongRequest";
import {DownloadSubscriptionRepository} from "../data/DownloadSubscriptionRepository";
import {SongFetchJob} from "../services/SongFetchJob";
import {JobDispatchService} from "../services/JobDispatchService";
import {IAPIController} from "../IAPIController";
import * as restify from 'restify'
import * as _ from 'lodash'
import * as fs from 'fs'
const nodeID3 = require('node-id3');

export class MusicDownloadRequestController implements IAPIController {
  private _jobService: JobDispatchService;

  constructor() {
    // TODO: Send the proper queue into here
    this._jobService = new JobDispatchService();
    this._jobService.addJobHandler('SongFetchJob', new SongFetchJobHandler());
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

      const downloadRepo = new DownloadRepository();
      const repo = new DownloadSubscriptionRepository();

      const value = downloadRepo.getDownloadForUrl(body.url)
      if (value != null) {
        // Don't bother sending the dispatch job, when the user hits
        // their async queue it will show up there

        // Add it though, so they do actually /see/ it
        repo.addUrlForToken(body.token, body.url)

        return response.send(200, {});
      }

      // Process the actual job since the user seems to be within acceptable
      // bounds to perform this operation
      const fetchJob = new SongFetchJob(body.url, body.token);
      this._jobService.dispatchJob(fetchJob).then((jobResult: any) => {
        let request = new SongRequest(jobResult._originalUrl, jobResult._pathOnDisk, jobResult._meta)
        this._persistJob(fetchJob, request)
      }).catch((error) => {
        console.log(error)
      })

      // Send the job to the users queue for them to view on the page
      // when they need access to it
      repo.addUrlForToken(body.token, body.url)

      // Send a response to let the user know everything went OK
      return response.send(200, {});
    })


    server.get('/downloads', (request: restify.Request, response: restify.Response, next: restify.Next) => {
      var body = request.params || {};

      const repo = new DownloadSubscriptionRepository();
      const downloadRepo = new DownloadRepository();

      const urls = repo.getSubscribedUrlsForToken(body.token);
      const requests = urls.map((url) => {
        const download = downloadRepo.getDownloadForUrl(url)
        if (download) {
          return download;
        } else {
          return null;
        }
      }).filter((value) => value !== null).map((download) => {
        return download;
      })

      // Send the requests as is...
      response.send(200, requests);
    })

    server.get('/download/:id', (request: restify.Request, response: restify.Response, next: restify.Next) => {
      var id = request.params.id;
      const downloadRepo = new DownloadRepository();
      const r = downloadRepo.getDownloadById(id);

      if (r) {
        response.contentType = "audio/mpeg";

        // Set the filename
        const tags = nodeID3.read(r.path)
        const filename = `${tags.artist} - ${tags.title}`;
        response.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');

        fs.readFile(r.path, (err, data) => {
          response.send(200, data)
        })
      } else {
        response.send(400);
      }

    });

  }

  private _persistJob(job: SongFetchJob, jobResult: SongRequest) {
    if (jobResult) {
      console.log('Job was finished... adding to the persistent storage.')

      // Once it's in the cache, then the other calls can assume
      // that it's ready for others to consume
      const repo = new DownloadRepository();
      repo.addDownloadToCache(jobResult);
    } else {
      console.log('Failed to complete the job... :(')
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
