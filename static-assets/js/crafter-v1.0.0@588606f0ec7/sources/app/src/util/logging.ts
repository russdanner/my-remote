/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

const console = window.console || (<Console> {
  log: () => void 0,
  warn: () => void 0,
  error: () => void 0
});

export function log(...messages: any[]) {
  console.log(...messages);
}

export function error(...errors: any[]) {
  console.error(...errors);
}

export function warn(...warnings: any[]) {
  console.warn(...warnings);
}
