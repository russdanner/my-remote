<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# Channel API

Channel related calls.

**Table of Contents**
 - [Get Channel by Id](#get-channel-by-id)
 - [Get Clips by Channel](#get-clips-by-channel)
 - [Tag](#tag)
 - [Untag](#untag)
 - [Favorite](#favorite)
 - [Unfavorite](#unfavorite)

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Get Channel by ID

Get a channel by channel id

**Request URL** [GET] `/api/1/channel/{channelId}.json`

**Response** - [Channel Model](../app/src/models/Channel.ts)
```js
{
  "entry": {
    /* Channel Model */
  }
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Get Clips by Channel
Get a channel's clips by channel id

**Request URL** [GET] `/api/1/channel/{channelId}/clips.json`

**Response** - [Clip Models](../app/src/models/Clip.ts)
```js
{
  "entries": [
    { /* Clip Model */ },
    ...
  ]
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Get Episodes by Channel
Get a channel's episodes by channel id

#### Request
- **URL** [GET] `/api/1/channel/{channelId}/episodes.json`

#### Response 
Array [Episode Models](../app/src/models/Episode.ts) (as entries)  
```typescript
interface GetEpisodesByChannel {
  entries: Array<Episode>;
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Tag a Channel

Tag a channel with one or more tags

**Request URL** [POST] `/api/1/channel/{channelId}/tag.json`

**Request Body** — [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : [ /* Tag Model */,
    /* Tag Model */,
    "tag without times",
    "tag without times" ]
}
```

**Response** — Updated [Channel Model](../app/src/models/Channel.ts)
```js
{
  "entry": { /* Channel Model */ }
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Untag

Remove one or more tags. If a tag is specified as a string or without any times, all tag times are removed. Otherwise, only the specified times are removed

**Request URL** [POST] `/api/1/channel/{channelId}/untag.json`

**Request Body** [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : [ "tag",
    /* Tag Model */ ]
}
```

**Response** — Updated [Channel Model](../app/src/models/Channel.ts)
```js
{
  "entry": { /* Channel Model */ }
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Favorite

Mark a channel as favorite for current user

**Request URL** [POST] `/api/1/channel/{channelId}/favorite.json`

**Response** — Updated list of favorite channel ids for current user
```js
{
  "entries": [ "channelId", "channelId", ... ]
}
```

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Unfavorite

Unmark a channel as favorite for current user

**Request URL** [POST] `/api/1/channel/{channelId}/unfavorite.json`

**Response** — Updated list of favorite channel ids for current user
```js
{
  "entries": [ "channelId", "channelId", ... ]
}
```
