/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.utils.RequestUtils
import org.apache.log4j.Logger
import org.apache.log4j.Level

/**
 *  Runtime alternative to modifying shared/classes/crafter/engine/extension/log4j-override.xml
 */

try {
    def req = RequestUtils.getJson(request)

    if(!req.class) {
        throw new HttpStatusCodeException(400, "No class attribute provided on request")
    }
    if(!req.level) {
        throw new HttpStatusCodeException(400, "No level attribute provided on request")
    }

    def log = Logger.getLogger(req.class)
    def originalLevel = log.getLevel().toString()
    log.setLevel(Level.toLevel(req.level.toLowerCase()))

    return [
        className: req.class,
        from: originalLevel,
        to: req.level.toUpperCase()
    ]
} catch (IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
