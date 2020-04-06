/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import * as moment from 'moment-timezone';
import { TIME } from './constants';
import { TimeOfDay } from '../models/TimeOfDay';

export function formatTime(time: number | string | Date, timezone: string = 'UTC', format: string = TIME) {
  if (typeof time === 'string') {
    time = parseInt(time, 10);
  }
  return moment(time).tz(timezone).format(format);
}

export function getTimezoneUTCOffset(timezone: string): number {
  return moment.tz(timezone).utcOffset();
}

export function dayInfo(timezone: string, time: number = Date.now()) {
  const now = moment(time).tz(timezone);

  const timeOfDay = now.format('HH:mm:ss');

  now.hours(0);
  now.minutes(0);
  now.seconds(0);
  now.milliseconds(0);
  const startTime = now.toDate().getTime();

  now.hours(23);
  now.minutes(59);
  now.seconds(59);
  now.milliseconds(59);
  const endTime = now.toDate().getTime();

  return {
    now: moment().tz(timezone),
    timeOfDay,
    startTime,
    endTime
  };
}

export function timeOfDayToMoment(timeOfDay: TimeOfDay): moment.Moment {
  return moment().set('hours', timeOfDay.hours).set('minutes', timeOfDay.minutes);
}
