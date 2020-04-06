<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# User API

**Table of Contents**
- [Get User](#get-user)
- [Update User](#update-user)

@See 
- [User Model](../app/src/models/User.ts)
- [Timezones](../app/src/enums/Timezones.ts)
- [QueryConfig](../app/src/models/SearchQuery.ts)

***

## Get User

Get a user by user id

**Request URL** [GET] `/api/1/user/{userId}.json`

**Response** - [User Model](../app/src/models/User.ts)
```js
{
  "entry": { /* User Model */ }
}
```

***

## Update User

Update one or more of the [User model](../app/src/models/User.ts) fields.
Service should update only the properties sent on the request body.

@See 
- [Timezones](../app/src/enums/Timezones.ts)
- [QueryConfig](../app/src/models/SearchQuery.ts)

**Request URL** [POST] `/api/1/user/update.json`

**Request Body** JSON string of User Model properties.
```typescript
{
  timezone: string;
  searchConfig: JSON<User.searchConfig>;
}
```

**Response** — The updated [User model](../app/src/models/User.ts)
```js
{ 
  "entry": { /* User Model */ }
}
```
