<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# List of Values API

List of values API to retrieve all possible values of a certain type.

@See [LoV Model](../app/src/models/LoV.ts)

**Index**
 - [Get LoV](#get-lov)

## Get LoV

Get a list of values by id. Possible values:

[Ticket #37](https://github.com/craftersoftware/aws-project-a/issues/37)

**Request URL** [GET] `/api/1/lov/{lovId}.json`

Where `lovId` is one of:
* `language`
* `country`
* `tag`
* `channel`
* `topic`
* `clip-download`

**Example:**
- Get all languages
  - [GET] `/api/1/lov/language.json`
- Get all countries
  - [GET] `/api/1/lov/country.json`
- Get all tags
  - [GET] `/api/1/lov/tag.json`
- Get all channels
  - [GET] `/api/1/lov/channel.json`
- Get all Topics
  - [GET] `/api/1/lov/topic.json`
- Get all Clip Downloads
  - [GET] `/api/1/lov/clip-download.json`
- Get all days of the week
  - [GET] `/api/1/lov/daysOfWeek.json`
- Get all programs
  - [GET] `/api/1/lov/program.json`
- Get all sort options
  - [GET] `/api/1/lov/sort.json`
- Get all sort orders
  - [GET] `/api/1/lov/sortOrder.json`

**Response**
```js
{
  "entries": [ { /* LoV Model */ }, ... ]
}
```
