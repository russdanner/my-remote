/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxResponse, Observable, Subject } from 'rxjs';
import { catchError, map, mapTo, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import * as Mousetrap from 'mousetrap';
import { createStreamUrl, fireAndTerminateSubjects } from '../util';
import { of } from 'rxjs/observable/of';

export function pollForSignedCookie() {
  const
    stop$ = new Subject<void>(),
    request$ = ajax.get(`${process.env.REACT_APP_API_BASE_URL}/cookie/set.json`)
      .pipe(
        takeUntil(stop$),
        map((response: AjaxResponse) => ((response.response.expires * 1000) * .9))
      );

  const exec = () => request$
    .subscribe(
      time => timer(time)
        .pipe(takeUntil(stop$))
        .subscribe(exec)
    );

  exec();

  return () => fireAndTerminateSubjects(stop$);
}

export function determinePlayability(url: string, start: number, end?: number): Observable<string> {
  const
    uri = createStreamUrl(url, start, end),
    errorTrap = catchError<any, string>(() => of(url)),
    hasEnd = !!end;
  return ajax({
    url: uri,
    crossDomain: true,
    withCredentials: true
  }).pipe(
    mapTo(uri),
    hasEnd
      ? catchError(() =>
        ajax({
          url: createStreamUrl(url, start),
          crossDomain: true,
          withCredentials: true
        }).pipe(
          mapTo(createStreamUrl(url, start)),
          errorTrap
        ))
      : errorTrap
  );
}

export function takeScreenShot(video: HTMLVideoElement): Promise<Blob> {

  const
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');

  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => resolve(blob));
    } catch (e) {
      reject(null);
    }
  });

}

export function openScreenshot(blob: Blob): void {
  window.open(window.URL.createObjectURL(blob), '_blank');
}

export function attachPlayerShortcuts(
  events: {
    play?: Function,
    fastForward?: Function,
    rewind?: Function,
    fullscreen?: Function,
    exitFullScreen?: Function,
    mute?: Function
  }): () => void {

  (events.play) && Mousetrap.bind('space', (e) => {
    return !!events.play();
  });
  (events.fastForward) && Mousetrap.bind('>', () => {
    return !!events.fastForward();
  });
  (events.rewind) && Mousetrap.bind('<', () => {
    return !!events.rewind();
  });
  (events.fullscreen) && Mousetrap.bind(['f', 'F', 'f11'], () => {
    return !!events.fullscreen();
  });
  (events.exitFullScreen) && Mousetrap.bind('esc', () => {
    return !!events.exitFullScreen();
  });
  (events.mute) && Mousetrap.bind(['m', 'M'], () => {
    return !!events.mute();
  });

  return () => {
    // We can harmlessly unbind all possible shortcuts even if all weren't passed in.
    Mousetrap.unbind('space');
    Mousetrap.unbind('>');
    Mousetrap.unbind('<');
    Mousetrap.unbind(['m', 'M']);
    Mousetrap.unbind(['f', 'F', 'f11']);
    Mousetrap.unbind('esc');
  };
}
