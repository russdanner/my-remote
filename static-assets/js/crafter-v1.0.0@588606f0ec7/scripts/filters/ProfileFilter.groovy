/*
* Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
*
* This program is licensed under the Crafter Enterprise Software License Agreement,
* and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
* Unauthorized use, distribution, or modification is strictly prohibited.
*/

import org.craftercms.engine.security.PersonaAuthentication
import org.craftercms.profile.api.Profile
import org.craftercms.security.utils.SecurityUtils
import org.craftercms.site.videocenter.utils.CollectionUtils

import org.bson.types.ObjectId
import groovy.json.JsonOutput

def usernameHeader = "${siteConfig.getProperty('headers.username')}",
    firstNameHeader = "${siteConfig.getProperty('headers.firstName')}",
    lastNameHeader = "${siteConfig.getProperty('headers.lastName')}",
    emailHeader = "${siteConfig.getProperty('headers.emailAddress')}",
    groupsHeader = "${siteConfig.getProperty('headers.userGroups')}"

// support requests without headers
def anonymousId = "${siteConfig.getProperty('users.anonymous')}" as String

logger.debug("Available headers: {}", Collections.list(request.getHeaderNames()))

def firstName = request.getHeader(firstNameHeader) ?: '',
    lastName = request.getHeader(lastNameHeader) ?: '',
    username = request.getHeader(usernameHeader) ?: anonymousId,
    email = request.getHeader(emailHeader) ?: '',
    groups = CollectionUtils.toList(request.getHeader(groupsHeader)?.split(",")),
    attributes = [
        firstName: firstName,
        lastName: lastName
    ]

def roleValues = applicationContext.taxonomyService.getRoles(groups)

def profile = new Profile()
profile.setId(ObjectId.get())
profile.setUsername(username)
profile.setEmail(email)
profile.setEnabled(true)
profile.setVerified(true)
profile.setCreatedOn(new Date())
profile.setLastModified(new Date())
profile.getRoles().addAll(roleValues)
profile.setTenant(siteContext.siteName)

//update & retrieve user
def user = applicationContext.userService.updateUser(profile,
    firstName,
    lastName,
    groups)

// complete profile attributes
attributes.groups = groups
attributes.favoriteChannels = user.favoriteChannelIds
attributes.favoriteClips = user.favoriteClipIds
attributes.favoriteEpisodes = user.favoriteEpisodeIds
attributes.timezone = user.timezone
attributes.searchConfig = JsonOutput.toJson(user.searchConfig)

profile.setAttributes(attributes)

// inject profile created here to context for downstream support of global "profile" variable
SecurityUtils.setAuthentication(request, new PersonaAuthentication(profile))

filterChain.doFilter(request, response)
