/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import org.craftercms.engine.exception.HttpStatusCodeException

def channelId = pathVars.channelId

def channel = applicationContext.get("channelService").getChannel(channelId)

if (!channel) {
	throw new HttpStatusCodeException(404, "Channel ${channelId} site item not found")
}

return [ "entry": channel ]
