/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

export interface Snapshot {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  userId: string; // Created by User id
  snapshotTime: string; // GMT Date string ISO format
  channelId: string;
  thumbnailUrl: string;
}
