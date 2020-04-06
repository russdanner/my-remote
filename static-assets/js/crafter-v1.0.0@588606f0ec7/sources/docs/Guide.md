# Guide API

Guide related calls

**Table of Contents**
- [Get Guide](#get-guide)
- [Get Live & Upcoming Info](#get-live--upcoming-info)

## Get Guide

Retrieves the guide information for the channel id(s) supplied by the requestor.

#### Request

- **URL** [GET] `/api/1/guide.json`
- **Query params** [GuideRequest](../app/src/models/Guide.ts#L21)

#### Response

- **Format** [GuideResponse](../app/src/models/Guide.ts#L27)
- **Sample Response**
```json
{
  "episodes": [{/* Episode 1 */}, {/* Episode 2 */}],
  "channels": [{/* Channel */}, {/* Channel */}],
  "programs": [{/* Program */}, {/* Program */}],
  "entries": {
    "channel-1-id": {
      "episodeIds": ["episode1","episode2"]
    }
  }
}
```
