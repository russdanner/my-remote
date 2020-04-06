# Clip API

Clip Related Calls

**Table of Contents**
- [Get Clip by id](#get-clip-by-id)
- [Create clip](#create-clip)
- [Get Clip Status](#get-clip-status-by-id)
- [Retry clip download creation](#retry-clip)
- [Get Clip Download Url](#get-clip-download-url-by-id)
- [Update Clip](#update-clip)
- [Tag](#tag)
- [Untag](#untag)
- [Favorites](#favorite)
- [Unfavorite](#unfavorite)
- [Get Transcript Track](#transcript-track)
- [Add Topic](#add-topic)
- [Remove Topic](#remove-topic)
- [Add Topic Country](#add-topic-country)
- [Remove Topic Country](#remove-topic-country)

## Get Clip by ID

Get a [Clip](../app/src/models/Clip.ts) by id

**Request URL** [GET] `/api/1/clip/{clipId}.json`

**Response** - [Clip Model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```

## Create Clip

Create a [Clip](../app/src/models/Clip.ts).

### Backend Mechanics

- UI will send a channel ID for meta-data to be copied from. From the channel, copy:
  - Description
  - Tags
  - Language
  - Country
  - Bitrate
- Set the clip's createdBy to be the user in session — who is  submitting the request.

(This way everything is less hackable. All of the values come directly from the original source.)

### UI Mechanics

**Overview**
- The UI will create a clip initially using only start and stop bounds gotten from user input.
- Title should be auto-generated as `{year}.{month}.{day} {hours(24h)}:{minutes} from {channelName}`
- Once on the "Clip Viewer" view, user will update the individual fields as required; use Update clip API for each edit to be auto-saved.

**Data flow**
- User clicks record button on the ChannelViewer's UI
- ChannelViewer Component dispatches `START_RECORDING` action
- The player reducer...
  - Creates a new recording
  - Assigns it a uuid
  - Sets it's start time `toSeconds(Date.now())`
  - Sets the state's `activeRecordingId`
- While recording, user clicks record button on the ChannelViewer's UI
- Component dispatches `STOP_RECORDING`
- The player reducer sets `recordings[activeRecordingId].endTime = Date.now()`
- The channelViewer reducer sets state branch property `creatingClip = true`
- The ChannelViewer component reads property `creatingClip` to show/hide some of working indicator
- Epic listening to `STOP_RECORDING` grabs `activeRecordingId` and...
  - Calls create `ClipService`
    - Clip service returns the [new clip](../app/src/models/Clip.ts)
  - dispatches `RECORDING_CREATED`
- The channelViewer reducer sets property `creatingClip = false`
- The player reducer clears `activeRecordingId` and deletes `recordings[activeRecordingId]`
- The clips reducer adds new clip into it's `byId` prop
- The channels reducer adds new clip id into `channels[newClip.channeld].clipIds` (if channel is present)
- The clipViewer reducer sets `active = newClip.id`
- The ChannelViewer component reads `clipsViewer.active` and if `notNullOrUndefined`, opens clip view

**Request URL** [POST] `/api/1/clip/create.json`

**Request Body**
```typescript
interface CreateClipRequest {
    title: string;
    startTime: string; // Epoch Time (ms)
    endTime: string; // Epoch Time (ms)
    channelId: string;
    programId?: string;
    episodeId?: string;
  }
```

**Response** - [Clip Model](../app/src/models/Clip.ts)
```typescript
interface CreateClipResponse {
  entry: Clip;
}
```


## Retry Clip

Retry encoding process for an existing [Clip](../app/src/models/Clip.ts). Should only be invoked when clipStatus is "ERROR"

**Request URL** [POST] `/api/1/clip/{id}/retry.json`

**No Request Body**

**No Response**

Response will be standard HTTP status codes only


## Update Clip

Update one or more of the [Clip](../app/src/models/Clip.ts) fields. Service to update only the properties sent on the request body.

**Request URL** [POST] `/api/1/clip/{clipId}.json`

**Request Body** KV pairs of Clip Model properties
The transcription field may be a string for backwards compatibility, otherwise it will be an array of [Transcription models](../app/src/models/Transcription.ts).
```js
clip = {
    // All fields are optional
    "title" : string,
    "description" : string,
    "transcription" : string or [ /* Transcription model */ ],
    "keywords" : string
  }
```

**Response** — The updated [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Tag

Add one or more tags

**Request URL** [POST] `/api/1/clip/{clipId}/tag.json`

**Request Body** — [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : [ /* Tag Model */,
    /* Tag Model */,
    "tag without times",
    "tag without times" ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Untag

Remove one or more tags. If a tag is specified as a string or without any times, all tag times are removed. Otherwise, only the specified times are removed

**Request URL** [POST] `/api/1/clip/{clipId}/untag.json`

**Request Body** [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : [ "tag",
    /* Tag Model */ ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Transcript Track

Retrieve clip [WebVTT](https://www.w3.org/TR/webvtt1/) [transcript](../app/src/models/Transcription.ts) track

**Request URL** [GET] `/api/1/clip/{clipId}/track.json`

**Response** — String of any track data with start & end times
```
WEBVTT

/* track data */
```


## Favorite

Mark a clip as favorite for current user

**Request URL** [POST] `/api/1/clip/{clipId}/favorite.json`

**Response** — Updated list of favorite clip ids for current user
**Response Exceptions** - 400 - When No clipId passed in request , "No param 'id' provided in request path"
                        - 403 - No user is logged in
```json
{
  "entries": ["clipId", "clipId", "..."]
}
```


## Unfavorite

Remove clip as favorite for current user

**Request URL** [POST] `/api/1/clip/{clipId}/unfavorite.json`

**Response** — Updated list of favorite clip ids for current user
**Response Exceptions** - 400 - When No clipId passed in request , "No param 'id' provided in request path"
                        - 403 - No user is logged in
```json
{
  "entries": ["clipId", "clipId", "..."]
}
```


## Get Clip Status by ID

Efficiently get a [Clip](../app/src/models/Clip.ts)'s Status by id

**Request URL** [GET] `/api/1/clip/{clipId}/status.json`

**Response**
```js
{
  "clipStatus": string
}
```


## Get Clip Download Url by ID

Get a [Clip](../app/src/models/Clip.ts)'s download url based on resolution

**Request URL** [GET] `/api/1/clip/{clipId}/${resolution}/download.json`

**Response**
```js
{
  "url": string
}
```


## Add Topic

Add one or more topics

**Request URL** [POST] `/api/1/clip/{clipId}/addTopic.json`

**Request Body**
```js
{
  "topics" : [
    "topicId 1",
    "topicId 2"
  ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Remove Topic

Remove one or more topics

**Request URL** [POST] `/api/1/clip/{clipId}/removeTopic.json`

**Request Body**
```js
{
  "topics" : [
    "topicId 1",
    "topicId 2"
  ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Add Topic Country

Add one or more topic countries

**Request URL** [POST] `/api/1/clip/{clipId}/addTopicCountry.json`

**Request Body**
```js
{
  "topicCountries" : [
    "countryId 1",
    "countryId 2"
  ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```


## Remove Topic Country

Remove one or more topic countries

**Request URL** [POST] `/api/1/clip/{clipId}/removeTopicCountry.json`

**Request Body**
```js
{
  "topicCountries" : [
    "countryId 1",
    "countryId 2"
  ]
}
```

**Response** — Update [Clip model](../app/src/models/Clip.ts)
```js
{
  "entry": { /* Clip Model */ }
}
```
