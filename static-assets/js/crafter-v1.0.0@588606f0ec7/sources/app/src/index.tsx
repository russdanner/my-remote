/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/App';
import { createAppStore, notNullOrUndefined } from './util';
import { getLoVs, loadConfigsComplete, selectActiveUser, selectActiveUserComplete } from './actions/ActionCreators';
import { ConfigState } from './models/AppState';
import 'url-search-params-polyfill';
import { ajax } from './util/ajax';
import * as Mousetrap from 'mousetrap';

const store = createAppStore();

let userElement, configElement;
let elem = (selector: string) => document.querySelector(selector);

if (notNullOrUndefined(configElement = elem('#configurationModelJSON'))) {
  const config: ConfigState = JSON.parse(configElement.innerHTML);
  (ajax as any).init(config.LOGOUT_URL || '/mellon/logout?ReturnTo=/');
  store.dispatch(loadConfigsComplete(config));
}

store.dispatch(
  getLoVs(
    'language',
    'country',
    'tag',
    'topic',
    'channel',
    'timezone',
    'clip-download',
    'daysOfWeek',
    'sort',
    'sortOrder',
    'program'));

if (notNullOrUndefined(userElement = elem('#userModelJSON'))) {
  store.dispatch(
    selectActiveUserComplete(
      JSON.parse(userElement.innerHTML)));
} else if (notNullOrUndefined(userElement = elem('[data-user-id]'))) {
  store.dispatch(
    selectActiveUser(
      userElement.getAttribute('data-user-id')));
}

if (
  (process.env.NODE_ENV !== 'production') &&
  (localStorage && localStorage.getItem('project.a.reload.user') === 'true') &&
  notNullOrUndefined(userElement = elem('[data-user-id]'))
) {
  store.dispatch(selectActiveUser(
      userElement.getAttribute('data-user-id')));
}

Mousetrap.prototype.stopCallback = function(e: any, element: any, combo: any) {

  // if the element has the class "mousetrap" then no need to stop
  if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
    return false;
  }

  // stop for input, select, and textarea
  return element.tagName === 'INPUT' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA' ||
    (element.contentEditable && element.contentEditable === 'true') ||
    element.tagName === 'BUTTON';
};

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.querySelector('#root'));
