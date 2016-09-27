interface ISongSearchProvider {
  search(query: string): Promise<Array<SongSearchResult>>
}
