/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { AjaxError, AjaxResponse, Subject } from 'rxjs';

import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import * as React from 'react';
import { root } from './reducers/root';
import { MonoItemResponse } from './models/MonoItemResponse';
import { MultiItemResponse } from './models/MultiItemResponse';
import { rootEpic } from './epics';
import { LookupTable } from './models/LookupTable';
import { isNullOrUndefined } from 'util';
import { AppState, ListingView, LoVsState, UsersState } from './models/AppState';
import { LoV } from './models/LoV';
import { Clip } from './models/Clip';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { SearchResponse, SearchResults } from './models/SearchResults';
import { QueryConfig, SearchQuery } from './models/SearchQuery';
import { fromEvent } from 'rxjs/observable/fromEvent';
import * as moment from 'moment-timezone';
import { User } from './models/User';
import { Tag } from './models/Tag';
import { formatTime } from './util/datetime';
import {
  APP_DATE_TIME_FORMAT,
  APP_DATE_TIME_FORMAT_EXT,
  contextTypesCommon,
  DATE,
  MS_TO_S_FACTOR,
  TIME,
  TIME_W_SECONDS
} from './util/constants';
import { MediaAsset } from './models/MediaAsset';
import { AssetType, AssetTypes, ClipableAsset } from './util/types';
import { warn } from './util/logging';
import { Episode } from './models/Episode';
import { Program } from './models/Program';

const clearOnReload = true;

export const ResizeMonitor = fromEvent(window, 'resize').pipe(map((e) => window.innerWidth));

function clearPersistedState() {
  try {
    localStorage.removeItem('state');
  } catch (e) {
    // doing nothing when it fails
  }
}

function loadState() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

function persistState(state: AppState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    // doing nothing when it fails
  }
}

export function createAppStore() {

  clearPersistedState();

  const epicMiddleware = createEpicMiddleware(rootEpic);

  let enhancers = compose;
  if (process.env.NODE_ENV !== 'production') {
    enhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
  }

  const store = createStore(
    root,
    enhancers(applyMiddleware(epicMiddleware)));

  return store;

}

export function setContextTypes(target: any) {
  target.contextTypes = contextTypesCommon;
  return target;
}

export function extractResponseEntry<T>(result: AjaxResponse): T {
  const response = <MonoItemResponse<T>> result.response;
  return response.entry;
}

export function extractResponseEntries<T>(result: AjaxResponse): T[] {
  const response = <MultiItemResponse<T>> result.response;
  return response.entries;
}

export function emptySearchResponse() {
  return {
    total: 0,
    entries: [],
    users: [],
    facets: {},
    error: ''
  };
}

export function extractSearchResponse<T extends MediaAsset>(result: AjaxResponse): SearchResults<T> {
  const response = <SearchResponse<T>> result.response;
  if (isNullOrUndefined(response)) {
    return emptySearchResponse();
  }
  return {
    total: response.total,
    users: response.users || [],
    entries: response.entries.map(entry => {
      let entity = entry.entry;
      entity.assetType = entry.assetType;
      return entry.entry;
    }),
    facets: response.facets.reduce(
      (table, entry) => {
        table[entry.type === 'tags' ? 'tag' : entry.type] = entry.values;
        return table;
      },
      {}),
    error: response.error
  };
}

export function urlWithQuery(url: string, params: any) {
  try {
    let query = new URLSearchParams(params);
    return `${url}?${query.toString()}`;
  } catch (ex) {
    // Edge has no support for URLSearchParams
    let query = [];
    Object.keys(params).forEach((key) => {
      query.push(`${key}=${encodeURIComponent(params[key])}`);
    });
    return `${url}?${query.join('&')}`;
  }
}

export function configureQuery(config: QueryConfig, assetTypes: AssetType): SearchQuery {
  const query: SearchQuery = { assetTypes };
  const transform = (a: LoV[]) => (a || []).map(lov => lov.key).join(',');
  query.size = config.size;
  query.start = config.start;
  query.query = config.query || '';
  query.keywords = config.keywords || '';
  query.favorite = config.favorite || false;
  query.channels = transform(config.channels);
  query.countries = transform(config.countries);
  query.languages = transform(config.languages);
  query.tags = transform(config.tags);

  if (config.sort) {
    query.sort = config.sort;
  }

  if (config.sortOrder) {
    query.sortOrder = config.sortOrder;
  }

  if (config.topics) {
    query.topics = transform(config.topics);
  }

  if (config.topicCountries) {
    query.topicCountries = transform(config.topicCountries);
  }

  if (config.programs) {
    query.programs = transform(config.programs);
  }

  return query;
}

export function createLookupTable<T>(list: T[], idProp: string = 'id'): LookupTable<T> {
  return list.reduce(
    (table: LookupTable<T>, item: any) => {
      table[item[idProp]] = item;
      return table;
    },
    {});
}

export function notNullOrUndefined(something: any) {
  return !isNullOrUndefined(something);
}

export function mapFromLoV(lovs: LoVsState, lovId: string, key: string): string {
  if (lovs.byId[lovId]) {
    const lovList: LoV[] = lovs.byId[lovId];
    const found = lovList.find(lov => lov.key === key);
    return found ? found.value : key;
  }
  return key;
}

export function mapLanguage(lovs: LoVsState, key: string): string {
  return mapFromLoV(lovs, 'language', key);
}

export function mapCountry(lovs: LoVsState, key: string): string {
  return mapFromLoV(lovs, 'country', key);
}

export function formatClipTime(time: number, userTimezone: string): string {
  return moment(time).tz(userTimezone).format(APP_DATE_TIME_FORMAT_EXT);
}

export function getAssetDuration(asset: AssetTypes): string {
  switch (asset.assetType) {
    case 'channel':
      return '24 hours';
    case 'clip':
    case 'episode':
      return getDuration(
        asset.startTime,
        asset.endTime);
    case 'program': {
      const
        startDate = new Date(),
        endDate = new Date();
      startDate.setUTCHours(asset.start.hours, asset.start.minutes);
      endDate.setUTCHours(asset.end.hours, asset.end.minutes);
      return getDuration(startDate.getTime(), endDate.getTime());
    }
    default:
      return '';
  }
}

export function getDuration(startTime: number, endTime: number): string {

  const
    fix = (value: number) =>
      Number.isInteger(value)
        ? value
        : value.toFixed(1),
    duration = (endTime - startTime),
    hours = duration / 3600000;

  if (60000 > duration) { // render seconds
    const seconds = duration / 1000;
    return seconds > 1 ? `${fix(seconds)} seconds` : `${fix(seconds)} second`;
  }

  if (3600000 > duration) { // render minutes
    const minutes = duration / 60000;
    return minutes > 1 ? `${fix(minutes)} minutes` : `${fix(minutes)} minute`;
  }

  return (hours > 1) ? `${fix(hours)} hours` : `${fix(hours)} hour`;

}

export function getClipDuration(startTime: string, endTime: string): string {
  const startTimeNumber: number = parseInt(startTime, 10);
  const endTimeNumber: number = parseInt(endTime, 10);
  return getDuration((startTimeNumber), (endTimeNumber));
}

export function generateMarks(startDate: number, endDate: number, userTimezone: string) {

  const size = (endDate - startDate);
  const markDistance = Math.ceil(size / 10);
  const timezone = userTimezone;
  let marks = {};
  let timestamp = -size;
  let printDate = true;
  let prevDate = null;
  let currentDate = null;
  let printSeconds = true;

  while (timestamp < 0) {
    const timeFormat = printSeconds ? TIME_W_SECONDS : TIME;

    let time = endDate + timestamp;

    currentDate = new Date(time).getDate();
    printDate = (currentDate !== prevDate);

    marks[timestamp / 1000] = {
      value: timestamp,
      label: (
        React.createElement(
          'div',
          { className: 'app-seeker-timestamp' },
          printDate
            ? [
              React.createElement('div', { key: `${time}_date` }, formatTime(time, timezone, DATE)),
              React.createElement('div', { key: `${time}_time` }, formatTime(time, timezone, timeFormat))
            ]
            : [
              React.createElement('div', { key: `${time}_time` }, formatTime(time, timezone, timeFormat))
            ])
      )
    };

    printSeconds = false;
    prevDate = currentDate;
    timestamp = timestamp + markDistance;

  }

  marks[0] = {
    value: 0,
    label: (
      React.createElement(
        'div',
        { className: 'app-seeker-timestamp' },
        [
          React.createElement('div', { key: `${endDate}_date` }, formatTime(endDate, timezone, DATE)),
          React.createElement('div', { key: `${endDate}_time` }, formatTime(endDate, timezone, TIME_W_SECONDS))
        ])
    )
  };

  return marks;

}

export function parseSeekerValue(
  start: number,
  end: number,
  value: number,
  fmt: string = 'MM/DD HH:mm',
  userTimezone: string
): string {
  // Millisecond rounding errors were causing seeker tooltips to not match time input.
  let seekerMoment = moment(seekerValueToTime(start, end, value));
  if (seekerMoment.milliseconds() > 500) {
    seekerMoment.add(1, 'second').startOf('second');
  } else {
    seekerMoment.startOf('second');
  }

  return seekerMoment.tz(userTimezone).format(fmt);
}

export function seekerValueToTime(start: number, end: number, value: number): number {
  let offset = (value * 1000);
  let time = end + offset;
  return Math.abs(time);
}

export function timeToHandlePosition(start: number, end: number, time: number) {
  return (time - end) / 1000;
}

/**
 * This works when creating clip from record/stop or when using trimmer, so basically
 * inherits data from channel and adds timing to the new clip, which is going to be sent
 * to the server
 * @param asset
 * @param startTime
 * @param endTime
 */
export function createNewClipData(asset: ClipableAsset, startTime: number, endTime: number): Clip {
  return {
    id: null,
    assetType: 'clip',
    channelId: getAssetChannelId(asset),
    programId: (asset.assetType === 'channel') ? null : (<Episode> asset).programId,
    episodeId: (asset.assetType === 'channel') ? null : asset.id,
    title: `${moment(startTime).tz('UTC').format(APP_DATE_TIME_FORMAT)} GMT from ${asset.title}`,
    description: asset.description,
    startTime: startTime,
    endTime: endTime,
    tags: [],
    countryId: asset.countryId,
    languageId: asset.languageId,
    userId: null,
    streamType: asset.streamType,
    url: null,
    thumbnailUrl: null,
    topics: [],
    topicCountries: [],
    audioOnly: asset.audioOnly,
    clipStatus: 'REQUESTED'
  };
}

export function getAssetChannelId(asset: AssetTypes) {
  switch (asset.assetType) {
    case 'channel':
      return asset.id;
    case 'clip':
      return (<Clip> asset).channelId;
    case 'episode': {
      return (<Episode> asset).channelId;
    }
    case 'program': {
      return (<Program> asset).channelId;
    }
    default:
      console.warn(`util/getAssetChannelId: Requested channel id for unsupported asset`, asset);
      return null;
  }
}

export function createLoVsFromTags(tags: Tag[]): LoV[] {
  return tags.map((tag) => {
    return {
      key: tag.label,
      value: tag.label
    };
  });
}

export function getCountryFlag(countryId: string) {
  return `/static-assets/images/flags/${countryId}.svg`;
}

export function catchAjaxError<T>(mock: T): MonoTypeOperatorFunction<T> {
  return catchError((error: AjaxError, caught) => {
    let errorMessage;

    if (notNullOrUndefined(error.response) && notNullOrUndefined(error.response.message)) {
      errorMessage = `${error.message}: ${error.response.message}`;
    } else {
      errorMessage = error.message;
    }
    try {
      if ('error' in mock) {
        mock['error'] = errorMessage;
      }
    } catch (e) {

    }
    warn(`[ERROR] ${errorMessage}`);
    return of(mock);
  });
}

export function millisToSeconds(millis: number): number {
  return Math.floor(millis * MS_TO_S_FACTOR);
}

export function createLoVsFromKeys(lovstransform: LookupTable<LoV>, keys: any[]): LoV[] {
  if (lovstransform && keys) {
    return keys.map((key) => lovstransform[key]);
  } else {
    return [];
  }
}

export function transformUserSearchConfigToQuery(lovs: LoVsState, searchConfig: User['searchConfig']): QueryConfig {
  let query: QueryConfig = {};
  query.countries = createLoVsFromKeys(lovs.byIdByKey['country'], (searchConfig.countries || []));
  query.topics = createLoVsFromKeys(lovs.byIdByKey['topic'], (searchConfig.topics || []));
  query.languages = createLoVsFromKeys(lovs.byIdByKey['language'], (searchConfig.languages || []));
  query.topicCountries = createLoVsFromKeys(lovs.byIdByKey['country'], (searchConfig.topicCountries || []));
  return query;
}

export function checkAllConfigLoVsLoaded(lovs: LoVsState): boolean {
  return (
    notNullOrUndefined(lovs.byId['language'])
    && notNullOrUndefined(lovs.byId['country'])
    && notNullOrUndefined(lovs.byId['tag'])
    && notNullOrUndefined(lovs.byId['topic'])
    && notNullOrUndefined(lovs.byId['clip-download'])
  );
}

export function getChannelLink(id: string) {
  return `/channel/${id}`;
}

export function getClipLink(clip: Clip) {
  const
    channelId: string = clip.channelId,
    clipId: string = clip.id;
  return location.hash.includes('channel')
    ? `/channel/${channelId}/clip/${clipId}`
    : `/clip/${clipId}`;
}

export function getAssetLink(asset: AssetTypes): string {
  switch (asset.assetType) {
    case 'channel':
      return getChannelLink(asset.id);
    case 'clip':
      return getClipLink(<Clip> asset);
    case 'episode': {
      const episode = (asset as Episode);
      return episode.programId ? `/program/${episode.id}` : `/channel/${episode.channelId}?s=${episode.startTime}`;
    }
    case 'program':
      return `/programs/${asset.id}`;
    default:
      console.warn(`util/getAssetLink: Requested link for unsupported assetType`, asset);
      return '';
  }
}

export function getClipAuthor(users: UsersState, clip: Clip) {
  return (clip.userId && users.byId[clip.userId] && users.byId[clip.userId]) || null;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function listingViewHasMore({ filters, total }: ListingView): boolean {
  return ((filters.start + filters.size) < total);
}

export function createStreamUrl(url: string, start: number, end?: number) {
  return notNullOrUndefined(end)
    ? `${url}?start=${(millisToSeconds(start))}&end=${millisToSeconds(end)}`
    : `${url}?start=${(millisToSeconds(start))}`;
}

export function fireAndTerminateSubjects(...subjects$: Subject<any>[]) {
  fireSubjects(...subjects$);
  terminateSubjects(...subjects$);
}

export function fireSubjects(...subjects$: Subject<any>[]): void {
  subjects$.forEach(subject$ => subject$.next());
}

export function terminateSubjects(...subjects$: Subject<any>[]): void {
  subjects$.forEach(subject$ => {
    subject$.complete();
    subject$.unsubscribe();
  });
}

export function orderCodes(sortTarget: string[], sortOrder: string[]): string[] {
  let length = sortOrder.length;
  const ref = sortOrder.reduce(
    (o, e, i) => {
      o[e] = length--;
      return o;
    },
    {});
  return sortTarget.sort((a, b) => {
    return ref[b] - ref[a];
  });
}

export function asArray<T>(oArrayLike: any): Array<T> {
  return Array.prototype.slice.call(oArrayLike, 0);
}

interface URLSearchParamsMock {
  get(key: string): string;
}

// TODO: get a pollyfill.
export function deserializeSearchParams(search: string): URLSearchParamsMock {
  try {
    return new URLSearchParams(search);
  } catch (e) {
    let
      array = search.substr(1).split('&'),
      params = array.reduce(
        (p, value) => {
          const a = value.split('=');
          p[a[0]] = a[1];
          return p;
        },
        {});
    return {
      get(key: string): string {
        return params[key];
      }
    };
  }
}
