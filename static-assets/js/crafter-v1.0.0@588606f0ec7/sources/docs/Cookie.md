<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

# Signed Cookie API

Signed cookies are used for video stream playback. They are initially provided by the CookieFilter which runs on all page & service requests. While playing videos, and before a period of "expires" seconds elapses, the set endpoint should be invoked to reassign signed cookies for use on the video playback requests.

## Set Cookie

**Request URL** [GET] `/api/1/cookie/set.json`

**No Request Body**

**Response Body**
```js
{
  "expires": secondsAfterWhichCookiesWillBeInvalid
}
```

Cookies will be assigned via response headers
