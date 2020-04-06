<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# Search API

Search API spec

## Search

Get [channels](../app/src/models/Channel.ts), [clips](../app/src/models/Clip.ts), [programs](../app/src/models/Program.ts)
and/or [episodes](../app/src/models/Episode.ts) in the system filtered by the request params. Unfiltered requests would
return all of the entities in the system that match the supplied `assetTypes` param.

**Request URL** [GET] `/api/1/search.json`

**Query params**

The backend shall handle receiving any combination of the keys as described by the
[SearchQuery model](../app/src/models/SearchQuery.ts) in the form of query string parameters - the UI shall serialize
the model as query string parameters.

Blank values of the keys should be ignored as if not supplied.

**Examples:**
- Get all channels
  - [GET] `/api/1/search.json?assetType=channel`
- Get clips with afganistan (93) or jordan (962) as "country" and with Arabic (ar) as language and with "topics" as topic1 and "topicCountries" as us
  - [GET] `/api/1/clip/list.json?assetType=clip&keywords=happy&countries=962,93&languages=ar&topics=topic1&topicCountries=us`
- Get channels and clips with keyword "happy" in language Spanish
  - [GET] `/api/1/clip/list.json?assetType=clip,channel&keywords=happy&countries=222&languages=es`
- Get all programs
  - [GET] `/api/1/search.json?assetType=program`
- Get all Episodes
  - [GET] `/api/1/search.json?assetType=episode`
  - Get channels and program with programId_s (10 Or 11) and language Spanish
    - [GET] `/api/1/clip/list.json?assetType=clip,episode&programs=10,11&countries=222&languages=es`

**Response** - [SearchResults Model](../app/src/models/SearchResults.ts)

```typescript
interface SearchResultResponse {
  // Total number of records that matched the query (useful for pagination).
  // In the case of querying `all` channels, for example. The value should
  // be the total number of channels in the system.
  total: number;
  entries: Array<{
    assetType : 'channel' | 'clip' | 'program' | 'episode';
    entry : Channel | Clip | Episode | Program;
  }>;
  facets: Array<{
    type: 'language' | 'country' | 'channel' | 'topic' | 'topicCountry' | 'program';
    values: Array<string>;
  }>;
  users: Array<User>;
  error: string; // error message if an error occurs executing the search
}
```
