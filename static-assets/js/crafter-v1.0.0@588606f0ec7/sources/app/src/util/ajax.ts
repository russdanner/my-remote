/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { catchError } from 'rxjs/operators';
import { ajax as rxajax } from 'rxjs/observable/dom/ajax';
import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { AjaxError, AjaxRequest, AjaxResponse, Observable } from 'rxjs';
import { AjaxCreationMethod } from 'rxjs/observable/dom/AjaxObservable';
import { notNullOrUndefined } from '../util';
import { warn } from './logging';

export const ajax: AjaxCreationMethod = ((env) => {

  let logoutURL = '';

  const create: any = (urlOrRequest: string | AjaxRequest): Observable<AjaxResponse | {}> => {
    return rxajax(urlOrRequest)
      .pipe(
        unAuthorizedHandler()
      );
  };

  create.get = get;
  create.post = post;
  create.put = put;
  create.patch = patch;
  create.getJSON = getJSON;
  create.delete = (url: string, headers?: Object): Observable<AjaxResponse> => {
    return rxajax.delete(url, headers);
  };
  create.init = (url: string) => {
    logoutURL = url;
  };

  function get(url: string, headers?: Object): Observable<AjaxResponse | {}> {
    return rxajax.get(url, headers)
      .pipe(
        unAuthorizedHandler()
      );
  }

  function post(url: string, body?: any, headers?: Object): Observable<AjaxResponse | {}> {
    return rxajax.post(url, body, headers)
      .pipe(unAuthorizedHandler());
  }

  function put(url: string, body?: any, headers?: Object): Observable<AjaxResponse | {}> {
    return rxajax.put(url, body, headers)
      .pipe(unAuthorizedHandler());
  }

  function patch(url: string, body?: any, headers?: Object): Observable<AjaxResponse | {}> {
    return rxajax.patch(url, body, headers)
      .pipe(unAuthorizedHandler());
  }

  function getJSON<T>(url: string, headers?: Object): Observable<T | {}> {
    return rxajax.getJSON<T>(url, headers)
      .pipe(unAuthorizedHandler());
  }

  function unAuthorizedHandler<T>() {
    return catchError((error: AjaxError, caught: Observable<T>) => {
      if (notNullOrUndefined(error.response) && notNullOrUndefined(error.response.message)) {
        warn(`${error.message}: ${error.response.message}`);
      } else {
        warn(error.message);
      }

      if (error.status === 403) {
        window.location.href = logoutURL;
      }
      // We want to rethrow an error here so the outer error handler catches.
      // Returning caught here triggers a retry which we don't want
      throw error;
    });
  }

  return <AjaxCreationMethod> create;

})(process.env);

/*
  Placing in specific service call ajax pipe as below should allow for development proxy to function
   in a targeted manner.

   ajax.get(url, headers)
      .pipe(devProxyIntercept(url, (newUrl) => ajax.get(newUrl, headers)));
 */
export const devProxyIntercept = ((env) => {
  return function onAjaxError<T>(
    urlOrRequest: string | AjaxRequest,
    retryCall: (newUrl: string) => Observable<T>
  ): MonoTypeOperatorFunction<T> {
    return catchError((error: AjaxError) => {
      if (error.status !== 404) {
        warn(`Fixture Proxy: Caught error with status code '${error.status}'. Not found calls should be 404s.`);
      }
      if (notNullOrUndefined(error.response) && notNullOrUndefined(error.response.message)) {
        warn(`${error.message}: ${error.response.message}`);
      } else {
        warn(error.message);
      }
      let newUrl;
      if (typeof urlOrRequest === 'string') {
        newUrl = determineUrl(urlOrRequest);
      } else {
        (<AjaxRequest> newUrl).url = determineUrl(urlOrRequest.url);
      }
      return retryCall(newUrl);
    });
  };

  function determineUrl(url: string): string {
    return url.replace(env.REACT_APP_API_BASE_URL, '/static-assets/fixtures');
  }
})(process.env);
