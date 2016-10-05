export abstract class IJob {
  static getJobKey(): string {
    throw new Error('Please implement me.')
  }

  abstract getJobRequestState(): any

}
