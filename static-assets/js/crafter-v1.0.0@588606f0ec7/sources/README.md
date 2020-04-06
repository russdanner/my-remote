<!---
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
--->

### Running SASS
- install sass locally
- Inside of `sources/`, depending on needs do one of the below:
  - `sass --watch sass/main.scss:../static-assets/css/main.css`
  - `sass --watch sass/main.scss:app/public/main.css`
  - `sass --update sass/main.scss:../static-assets/css/main.css`
  - `sass --update sass/main.scss:app/public/main.css`
  - `sass --watch sass/main.scss:../static-assets/css/main.css sass/main.scss:app/public/main.css`
  - `sass --update sass/main.scss:../static-assets/css/main.css sass/main.scss:app/public/main.css`
