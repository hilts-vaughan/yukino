export abstract class IJob {
  getJobKey(): string {
    throw new Error('Please implement me.')
  }

  abstract getJobRequestState(): any

}
