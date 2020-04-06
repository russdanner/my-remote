/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { ActionsObservable } from 'redux-observable';
import { Store } from 'redux';
import { AppState } from '../models/AppState';
import { Observable } from 'rxjs';
import { Channel } from '../models/Channel';
import { Program } from '../models/Program';
import { Episode } from '../models/Episode';
import { Clip } from '../models/Clip';

export type AssetTypes = Clip | Episode | Program | Channel;

export type AssetType = 'clip' | 'channel' | 'program' | 'episode';

export type ClipableAsset = Channel | Episode;

export type ViewMode = 'sm' | 'md' | 'horizontal';

export type EpicArray =
  Array<(
    action$: ActionsObservable<AppAction<any>>,
    store: Store<AppState>
  ) => Observable<AppAction<any>>>;
