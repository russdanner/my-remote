
# Episode API

Episode Related Calls

**Table of Contents**
- [Get Episode by id](#get-episode-by-id)
- [Update Episode](#update-episode)
- [Favorite Episode](#favorite)
- [Unfavorite Episode](#unfavorite)
- [Tag](#tag)
- [Untag](#untag)

<!-- 
************************************************************
************************************************************
************************************************************ 
-->

## Get Episode by ID

Get a [Episode](../app/src/models/Episode.ts) by id

**Request URL** [GET] `/api/1/episode/{episodeId}.json`

**Response**

```typescript
interface GetEpisodeByIdResponse {
  entry: Episode;
}
```

<!-- 
************************************************************
************************************************************
************************************************************
-->

## Update Episode

Update one or more of the [Episode](../app/src/models/Episode.ts) fields. 
Service to update only the properties sent on the request body.

**Request URL** [POST] `/api/1/episode/{episodeId}.json`

**Request Body** KV pairs of the user-editable Episode Model properties (listed below)

```typescript
interface UpdateEpisodeRequest {
  // All fields are optional
  title?: string;
  description?: string;
  url?: string; // Web UI should never send (or support)
}
```

**Response** — The updated [Episode model](../app/src/models/Episode.ts)

```typescript
interface UpdateEpisodeResponse {
  entry: Episode
}
```

<!-- 
************************************************************
************************************************************
************************************************************
-->

## Favorite

Mark a episode as favorite for current user

**Request URL** [POST] `/api/1/episode/{episodeId}/favorite.json`

**Response** — Updated list of favorite episode ids for current user
```typescript
interface FavoriteEpisodeResponse {
  entries: Array<string>;
}
```

<!-- 
************************************************************
************************************************************
************************************************************
-->

## Unfavorite

Unmark a episode as favorite for current user

**Request URL** [POST] `/api/1/episode/{episodeId}/unfavorite.json`

**Response** — Updated list of favorite episode ids for current user
```typescript
interface FavoriteEpisodeResponse {
  entries: Array<string>;
}
```

<!-- 
************************************************************
************************************************************
************************************************************
-->

## Tag

Add one or more tags

**Request URL** [POST] `/api/1/episode/{episodeId}/tag.json`

**Request Body** — [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : "tag",
    /* Tag Model */ ]
}
```

**Response** — The updated [Episode model](../app/src/models/Episode.ts)
```js
interface UpdateEpisodeResponse {
  entry: Episode
}
```

<!-- 
************************************************************
************************************************************
************************************************************
-->

## Untag

Remove one or more tags

**Request URL** [POST] `/api/1/episode/{episodeId}/untag.json`

**Request Body** [Tag models](../app/src/models/Tag.ts) and/or tag strings
```js
{
  "tags" : [ "tag",
    /* Tag Model */ ]
}
```

**Response** — The updated [Episode model](../app/src/models/Episode.ts)
```js
interface UpdateEpisodeResponse {
  entry: Episode
}
```
