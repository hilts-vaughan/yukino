export class DownloadSubscriptionRepository {
  private static _cache: Object = {};

  getSubscribedUrlsForToken(token: string): Array<string> {
    let urls = DownloadSubscriptionRepository._cache[token];

    if (!urls) {
      urls = [];
    }

    return urls;
  }

  addUrlForToken(token: string, url: string) {
    if (!DownloadSubscriptionRepository._cache[token]) {
      DownloadSubscriptionRepository._cache[token] = new Array<string>();
    }
    let urls = DownloadSubscriptionRepository._cache[token];
    urls.push(url)
  }
}
