/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import org.craftercms.engine.exception.HttpStatusCodeException

def userId = pathVars.userId

def user = applicationContext.userService.getUser(userId)

if(!user) {
    throw new HttpStatusCodeException(404, "User not found for id '${userId}'")
}

return [
	entry: user
]
