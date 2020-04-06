/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { LookupTable } from '../models/LookupTable';
import { GuideResponseEntry } from '../models/Guide';
import {
  AppState,
  ChannelsState,
  ClipsState,
  GuideState,
  ListingView,
  ProgramsState,
  UsersState
} from '../models/AppState';
import { notNullOrUndefined } from '../util';
import { PAGE_SIZE } from './constants';
import { User } from '../models/User';
import { AssetTypes } from './types';
import { warn } from './logging';
import { Clip } from '../models/Clip';
import { Episode } from '../models/Episode';
import { Channel } from '../models/Channel';
import {
  searchChannels,
  searchClips,
  searchEpisodes,
  searchPrograms,
  toggleChannelFavorite,
  toggleClipFavorite,
  toggleEpisodeFavorite
} from '../actions/ActionCreators';
import { SortOrder } from '../models/SearchQuery';

export function selectGuideEntriesFromState(state: AppState): LookupTable<GuideResponseEntry>;
export function selectGuideEntriesFromState(state: GuideState): LookupTable<GuideResponseEntry>;
export function selectGuideEntriesFromState(state: LookupTable<GuideResponseEntry>): LookupTable<GuideResponseEntry>;
export function selectGuideEntriesFromState(
  state: AppState | GuideState | LookupTable<GuideResponseEntry>
): LookupTable<GuideResponseEntry>;
export function selectGuideEntriesFromState(
  state: AppState | GuideState | LookupTable<GuideResponseEntry>
): LookupTable<GuideResponseEntry> {
  let byChannelId = <LookupTable<GuideResponseEntry>> state;
  if ('guide' in state) {
    byChannelId = (<AppState> state).guide.byChannelId;
  } else if ('byChannelId' in state) {
    byChannelId = (<GuideState> state).byChannelId;
  }
  return byChannelId;
}

export function hasGuideEntryLoaded(state: AppState, channelId: string): boolean;
export function hasGuideEntryLoaded(state: GuideState, channelId: string): boolean;
export function hasGuideEntryLoaded(state: LookupTable<GuideResponseEntry>, channelId: string): boolean;
export function hasGuideEntryLoaded(
  state: AppState | GuideState | LookupTable<GuideResponseEntry>,
  channelId: string
): boolean {
  let byChannelId = selectGuideEntriesFromState(state);
  return notNullOrUndefined(byChannelId[channelId]);
}

export function getGuideEpisodesByChannel(
  byChannelId: LookupTable<GuideResponseEntry>,
  channelId: string
) {
  try {
    return byChannelId[channelId].episodeIds;
  } catch (e) {
    return [];
  }
}

export function getDefaultListingViewState(): ListingView {
  return {
    filters: {
      start: 0,
      query: null,
      size: PAGE_SIZE,
      keywords: '',
      favorite: false,
      sortOrder: SortOrder.ASCENDING
    },
    facets: {},
    total: 0,
    entries: [],
    drillDown: false
  };
}

export function isFavorite(state: User, entity: AssetTypes): boolean;
export function isFavorite(state: UsersState, entity: AssetTypes): boolean;
export function isFavorite(state: UsersState | User, entity: AssetTypes): boolean {
  const user: User = ('byId' in state) ? getActiveUser(state) : state;
  if (notNullOrUndefined(user)) {
    let prop;
    switch (entity.assetType) {
      case 'channel':
        prop = 'favoriteChannelIds';
        break;
      case 'clip':
        prop = 'favoriteClipIds';
        break;
      case 'episode':
        prop = 'favoriteEpisodeIds';
        break;
      default:
        warn(
          `Unhandled assetType ${entity.assetType} received at state util function isFavorite.`,
          user,
          entity);
        return false;
    }
    return user[prop].includes(entity.id);
  } else {
    return false;
  }
}

export function isInMultiView(state: AppState, channelId: string) {
  return state.multiView.channels.includes(channelId);
}

export function getUserTimezone(state: AppState | UsersState) {
  if ('users' in state) {
    return getActiveUser(state.users).timezone || 'UTC';
  } else {
    return getActiveUser(state).timezone || 'UTC';
  }
}

export function isTogglingFavorite(state: AppState, asset: AssetTypes): boolean;
export function isTogglingFavorite(state: ClipsState, entityId: string): boolean;
export function isTogglingFavorite(state: ChannelsState, entityId: string): boolean;
export function isTogglingFavorite(state: ProgramsState, entityId: string): boolean;
export function isTogglingFavorite(
  state: AppState | ChannelsState | ClipsState | ProgramsState,
  entityOrId: string | AssetTypes
): boolean {
  if ('loading' in state && 'byId' in state) {
    return !!state.loading[`TOGGLE_FAVORITE.${entityOrId}`];
  } else {
    let
      tree,
      asset = <AssetTypes> entityOrId;
    switch (asset.assetType) {
      case 'channel':
        tree = 'channels';
        break;
      case 'clip':
        tree = 'clips';
        break;
      case 'episode':
        tree = 'episodes';
        break;
      default:
        warn(`util/isTogglingFavorite: Unsupported assetType ${asset.assetType} toggling state retrieval.`);
        return false;
    }
    return state[tree].loading[`TOGGLE_FAVORITE.${asset.id}`];
  }
}

export function isFavoriteChannel(state: UsersState | User, channel: Channel) {
  const user: User = ('byId' in state) ? getActiveUser(state) : state;
  return (notNullOrUndefined(user) && user.favoriteChannelIds.includes(channel.id));
}

export function isFavoriteClip(state: UsersState, clip: Clip) {
  const user: User = getActiveUser(state);
  return (notNullOrUndefined(user) && user.favoriteClipIds.includes(clip.id));
}

export function isFavoriteEpisode(state: UsersState, episode: Episode) {
  const user: User = getActiveUser(state);
  return (notNullOrUndefined(user) && user.favoriteEpisodeIds.includes(episode.id));
}

export function getToggleFavoriteAction(asset: AssetTypes) {
  switch (asset.assetType) {
    case 'channel':
      return toggleChannelFavorite(asset.id);
    case 'clip':
      return toggleClipFavorite(asset.id);
    case 'episode':
      return toggleEpisodeFavorite(asset.id);
    default:
      warn(`util/getToggleFavoriteAction: Unsupported assetType ${asset.assetType}.`);
      return { type: 'FOO' };
  }
}

export function getActiveUser(usersState: UsersState) {
  return usersState.byId[usersState.active];
}

export function getSearchAction(viewId: string) {
  switch (viewId) {
    case 'channels':
      return searchChannels;
    case 'clips': {
      return searchClips;
    }
    case 'programs': {
      return searchPrograms;
    }
    case 'episodes': {
      return searchEpisodes;
    }
    default:
      return null;
  }
}
