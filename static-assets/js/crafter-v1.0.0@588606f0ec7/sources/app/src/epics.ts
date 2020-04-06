/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { ActionsObservable, combineEpics, ofType } from 'redux-observable';
import { ActionTypes } from './actions/ActionTypes';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { AnyAction, Store } from 'redux';
import { AppState } from './models/AppState';
import { ChannelService } from './services/ChannelService';
import {
  findChannelClipsComplete,
  findChannelEpisodesComplete,
  getLov,
  getLovComplete,
  getLoVsComplete,
  getUserByIdComplete,
  selectActiveUserComplete,
  updateUserPreferencesComplete,
  updateUserTimezoneComplete
} from './actions/ActionCreators';
import { LoVService } from './services/LoVService';
import { LoV } from './models/LoV';
import { Clip } from './models/Clip';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from './services/UserService';
import { User } from './models/User';
import { SearchResults } from './models/SearchResults';
import { LookupTable } from './models/LookupTable';
import { LoVs } from './models/LoVs';
import { Episode } from './models/Episode';
import { guideEpics } from './epics/guide';
import { channelEpics } from './epics/channel';
import { clipEpics } from './epics/clip';
import { programEpics } from './epics/program';
import { playerEpics } from './epics/player';
import { episodeEpics } from './epics/episode';
import { getSearchAction } from './util/state';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';

// NOTE: Any epic must be added to the combine epics call
export const rootEpic = combineEpics(
  ...guideEpics,
  ...programEpics,
  ...channelEpics,
  ...clipEpics,
  ...episodeEpics,
  ...playerEpics,

  // FIND_CHANNEL_CLIPS
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.FIND_CHANNEL_CLIPS),
    switchMap(({ payload }) => ChannelService
      .getClips(payload)
      .pipe(map((clipsResults: SearchResults<Clip>) => findChannelClipsComplete(payload, clipsResults.entries))))
  ),

  // FIND_CHANNEL_EPISODES
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.FIND_CHANNEL_EPISODES),
    switchMap(({ payload }) => ChannelService
      .getEpisodes(payload)
      .pipe(map((episodeResults: SearchResults<Episode>) =>
        findChannelEpisodesComplete(payload, episodeResults.entries))
      )
    )
  ),

  // GET_LOV
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.GET_LOV),
    mergeMap(({ payload }) => LoVService.get(payload)
      .pipe(map((lovs: LoV[]) => {
        return getLovComplete(payload, lovs);
      })))
  ),

  // GET_LOVS
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.GET_LOVS),
    switchMap((action) => {
      const ids: LoVs[] = action.payload;
      return forkJoin(
        ids.map(id => LoVService.get(id)),
        (...responses: Array<LoV[]>) => responses.reduce(
          (table, lov, index) => ({ ...table, [ids[index]]: lov }),
          {  })
      ).pipe(map((lovLookup: LookupTable<LoV>) => getLoVsComplete(lovLookup)));
    })
  ),

  // USER_BY_ID get the current logged user information
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.USER_BY_ID),
    mergeMap(({ payload }) => UserService.byId(payload)
      .pipe(map((user: User) => {
        return getUserByIdComplete(user);
      }))
    )),

  // FETCH_USER_BY_ID get any other user different than logged user, e.g clips user/author etc
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.SELECT_ACTIVE_USER),
    mergeMap(({ payload }) => UserService.byId(payload)
      .pipe(map((user: User) => {
        return selectActiveUserComplete(user);
      }))
    )),

  // USER_PREF_DEFAULT_SEARCH_UPDATE
  (action$: ActionsObservable<AnyAction>, store: Store<AppState>) => action$.pipe(
    ofType(ActionTypes.USER_PREF_DEFAULT_SEARCH_UPDATE),
    mergeMap(({ payload }) => {
      const state = store.getState();
      const userId = state.users.active;
      let updatedUser = { ...state.users.byId[userId] };
      updatedUser.searchConfig = payload;
      return UserService.update(updatedUser)
        .pipe(
          map((user: User) => {
            return updateUserPreferencesComplete(user);
          })
        );
    })),

  // USER_TIMEZONE_UPDATE
  (action$: ActionsObservable<AnyAction>, store: Store<AppState>) => action$.pipe(
    ofType(ActionTypes.USER_TIMEZONE_UPDATE),
    mergeMap(({ payload }) => {
      const state = store.getState();
      const userId = state.users.active;
      let updatedUser = { ...state.users.byId[userId] };
      updatedUser.timezone = payload;
      return UserService.update(updatedUser)
        .pipe(
          map((user: User) => {
            return updateUserTimezoneComplete(user);
          })
        );
    })),
  (action$: ActionsObservable<AnyAction>) => action$.pipe(
    ofType(ActionTypes.REFRESH_LISTING_VIEW),
    mergeMap(({ payload }) => {
        let searchDispatch = getSearchAction(payload.viewId);
        return concat(
          // Only refreshing tags for now as they are the lovs that are most user changeable
          of(getLov('tag')),
          of(searchDispatch())
        );
    }))

);
