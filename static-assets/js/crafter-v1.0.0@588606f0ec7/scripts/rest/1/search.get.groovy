/*
 * Copyright (C) 2007-2018 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is licensed under the Crafter Enterprise Software License Agreement,
 * and its use is strictly limited to operation with Crafter CMS Enterprise Edition.
 * Unauthorized use, distribution, or modification is strictly prohibited.
 */

import org.craftercms.site.videocenter.utils.CollectionUtils
import org.craftercms.engine.exception.HttpStatusCodeException

def commaSplit = { param ->
	CollectionUtils.toList(param?.split(","))
}

def types = commaSplit(params.assetTypes)
def favorite = params.favorite?.toBoolean() ?: false

def keywords = params.keywords
def countries = commaSplit(params.countries)
def languages = commaSplit(params.languages)
def tags = commaSplit(params.tags)
def channels = commaSplit(params.channels)
def programs = commaSplit(params.programs)
def episodes = commaSplit(params.episodes)
def topics = commaSplit(params.topics)
def topicsCountry = commaSplit(params.topicCountries)

def start = params.start?.toInteger() ?: 0
def size = params.size?.toInteger() ?: Integer.MAX_VALUE
def sort = params.sort
def sortOrder = params.sortOrder

try {
	return applicationContext.mediaSearchService.search(keywords,
			countries,
			languages,
			tags,
			types,
			channels,
			programs,
			episodes,
			topics,
			topicsCountry,
			favorite,
			profile,
			start,
			size,
			sort,
			sortOrder)
} catch (IllegalArgumentException e) {
	throw new HttpStatusCodeException(400, e)	
}
