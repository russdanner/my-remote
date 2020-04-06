<#--
 - Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 -
 - This program is licensed under the Crafter Enterprise Software License Agreement,
 - and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 - Unauthorized use, distribution, or modification is strictly prohibited.
-->

<#assign model = siteItemService.getSiteItem("/site/website/index.xml") />
<#import "/templates/system/common/cstudio-support.ftl" as studio />

<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <meta name="theme-color" content="#ffffff">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <title>${model.title}</title>

  <link rel="shortcut icon" href="/static-assets/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Barlow:200,200i,400,400i,700,700i">
  <link rel="stylesheet" href="/static-assets/css/video-js.css">
  <link rel="stylesheet" href="/static-assets/css/react-datepicker.css">
  <link rel="stylesheet" href="/static-assets/css/main.css">

  <#if profile??>
  <script id="userModelJSON" type="application/json" data-user-id="${profile.username}">
    {
      "id": "${profile.username}",
      "username": "${profile.username}",
      "email": "${profile.email}",
      "firstName": "${profile.attributes.firstName}",
      "lastName": "${profile.attributes.lastName}",
      "timezone": <#if profile.attributes.timezone??>"${profile.attributes.timezone}"<#else>null</#if>,
      "searchConfig": ${profile.attributes.searchConfig},
      "favoriteChannelIds": [<#list profile.attributes.favoriteChannels as x>"${x}"<#sep>,</#sep></#list>],
      "favoriteClipIds":[<#list profile.attributes.favoriteClips as x>"${x}"<#sep>,</#sep></#list>],
      "favoriteEpisodeIds":[<#list profile.attributes.favoriteEpisodes as x>"${x}"<#sep>,</#sep></#list>],
      "groups":[<#list profile.attributes.groups as x>"${x}"<#sep>,</#sep></#list>],
      "roles":[<#list profile.roles as x>"${x}"<#sep>,</#sep></#list>]
    }
  </script>
  </#if>
  <script id="configurationModelJSON" type="application/json">
    {
      "CLIP_INITIAL_STATUS": "${siteConfig.getString('clips.initialStatus')}",
      "CLIP_SUCCESS_STATUS": "${siteConfig.getString('clips.successStatus')}",
      "CLIP_ERROR_STATUS": "${siteConfig.getString('clips.errorStatus')}",
      "CHANNEL_PLAYBACK_DAYS": "${siteConfig.getString('channels.cache')}",
      "PROGRAM_WRITE_ROLE": "${siteConfig.getString('users.roles.programWrite')}",
      "SET_SIGNED_COOKIES": ${siteConfig.getString('aws.signedCookies.enabled')},
      "LOGOUT_URL": "${siteConfig.getString('session.logoutUrl')}"
    }
  </script>

</head>
<body>
<noscript>You need to enable JavaScript to run this application.</noscript>
<div id="root"></div>
<script src="/static-assets/js/video.js"></script>
<script src="/static-assets/js/main.js"></script>
</body>
</html>
