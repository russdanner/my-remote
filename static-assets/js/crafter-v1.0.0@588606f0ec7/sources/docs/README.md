<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# API Docs

## Table of Contents

 - [Channel API](./Channel.md)
   - [Get by Channel ID](./Channel.md#get-by-channel-id)
   - [Get Clips by Channel](./Channel.md#get-clips-by-channel)
   - [Untag](./Channel.md#untag)
   - [Tag](./Channel.md#tag)
   - [Unfavorite](./Channel.md#unfavorite)
   - [Favorites](./Channel.md#favorite)

 - [Clip API](./Clip.md)
   - [Get Clip by ID](./Clip.md#get-clip-by-id)
   - [Create Clip](./Clip.md#create-clip)
   - [Get Clip Status](./Clip.md#get-clip-status-by-id)
   - [Retry clip download creation](./Clip.md#retry-clip)
   - [Get Clip Download Url](./Clip.md#get-clip-download-url-by-id)
   - [Update Clip](./Clip.md#update-clip)
   - [Tag](./Clip.md#tag)
   - [Untag](./Clip.md#untag)
   - [Transcript](./Clip.md#Transcript-Track)
   - [Favorites](./Clip.md#favorite)
   - [Unfavorite](./Clip.md#unfavorite)
   - [Add Topic](./Clip.md#add-topic)
   - [Remove Topic](./Clip.md#remove-topic)
   - [Add Topic Country](./Clip.md#add-topic-country)
   - [Remove Topic Country](./Clip.md#remove-topic-country)

 - [Program API](./Program.md)
   - [Create Program](./Program.md#create-program)
   - [Get Program by ID](./Program.md#get-program-by-id)
   - [Update Program](./Program.md#update-program)

 - [Episode API](./Episode.md)
   - [Get Episode by id](./Episode.md#get-episode-by-id)
   - [Update Episode](./Episode.md#update-episode)
   - [Favorite Episode](./Episode.md#favorite)
   - [Unfavorite Episode](./Episode.md#unfavorite)
   - [Tag Episode](./Episode.md#tag)
   - [Untag Episode](./Episode.md#untag)

 - [Guide API](./Guide.md)
    - [Get Guide](./Guide.md#get-guide)
    - [Get Live & Upcoming Info](./Guide.md#get-live--upcoming-info)

 - [User](./User.md)
    - [Get User](./User.md#get-user)
    - [Update User](./User.md#update-user)

 - [Search](./Search.md)

 - [LoV](./LoV.md)

 - [Cookie](./Cookie.md)

## Models

 - [User](../app/src/models/User.ts)
 - [Channel](../app/src/models/Channel.ts)
 - [Program](../app/src/models/Program.ts)
 - [Clip](../app/src/models/Clip.ts)
 - [LoV](../app/src/models/LoV.ts)
 - [Snapshot](../app/src/models/Snapshot.ts)
 - [LookupTable](../app/src/models/LookupTable.ts)
 - [Moment](../app/src/models/Moment.ts)
 - [AppState](../app/src/models/AppState.ts)
 - [SearchQuery](../app/src/models/SearchQuery.ts)
 - [Transcription](../app/src/models/Transcription.ts)


## Response Standards

The HTTP status codes below are returned for the respective scenarios:

 - 200 Successful request processing
 - 400 Bad request (invalid or missing parameters)
 - 403 Forbidden if request is a restricted user action
 - 404 Requested data resource not found
 - 500 Server Error
