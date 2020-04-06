/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import * as PropTypes from 'prop-types';

export const CODE_PLAY_BOUNDS = -3;
export const CODE_RESET_AND_GOTO_LIVE = -4;
export const contextTypesCommon = { store: PropTypes.object };
export const APP_DATE_TIME_FORMAT = 'YYYY.MM.DD HH:mm';
export const APP_DATE_TIME_FORMAT_EXT = 'YYYY.MM.DD HH:mm:ss';
export const TWENTY_FOUR_HOURS = 86400000;
export const ONE_HOUR = 3600000;
export const FIVE_MINUTES = 300000;
export const TEN_MINUTES = 600000;
export const FIFTEEN_MINUTES = 900000;
export const MS_TO_S_FACTOR = 0.001;
export const PAGE_SIZE = 12;
export const DATE = 'MM/DD';
export const TIME = 'HH:mm';
export const TIME_W_SECONDS = 'HH:mm:ss';
export const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HOUR_MIN_SEC_INPUT_PATTERN = '^([0-9]|0[0-9]|1[0-9]|2[0-3])(:([0-5][0-9]|[0-9]))?(:([0-5][0-9]|[0-9]))?$';
