/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { Observable } from 'rxjs/Observable';
import { QueryConfig } from './SearchQuery';
import { Channel } from './Channel';
import { Clip } from './Clip';
import { SearchResults } from './SearchResults';

export interface IChannelService {
  byId(channelId: string): Observable<Channel>;
  getClips(channelId: string): Observable<SearchResults<Clip>>;
  tag(channelId: string, tags: string[]): Observable<Channel>;
  untag(channelId: string, tags: string[]): Observable<Channel>;
  favorite(channelId: string): Observable<string[]>;
  unfavorite(channelId: string): Observable<string[]>;
  find(query: QueryConfig): Observable<SearchResults<Channel>>; // Call SearchService
}
