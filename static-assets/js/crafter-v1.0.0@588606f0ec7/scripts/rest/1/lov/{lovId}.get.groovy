/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import org.craftercms.engine.exception.HttpStatusCodeException

def lovId = pathVars.lovId

try {
    def lov = applicationContext["lovService"].getValues(lovId)

    return [
      entries: lov
    ]
} catch(IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
