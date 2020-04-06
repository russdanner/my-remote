/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import { AssetTypes } from './types';
import { User } from '../models/User';

export function isProgram(asset: AssetTypes): boolean {
  return asset.assetType === 'program';
}

export function hasRole(user: User, role: string): boolean {
  return user.roles.includes(role);
}
