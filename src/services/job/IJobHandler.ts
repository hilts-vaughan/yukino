/**
 * This interface is used to allow job handlers to register themselves
 * as needing a specific piece of data in order to be able to do this
 */
export interface IJobHandler {
  /**
   * Handles a request of data input type T, where the result is type X.
   * @type Returns a promise containing a value X, for this job result.
   */
  handleRequest<T, X>(data: T): Promise<X>;
}
