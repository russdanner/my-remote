import org.craftercms.engine.exception.HttpStatusCodeException

def episodeId = pathVars.episodeId

def episode = applicationContext.episodeService.getEpisode(episodeId)

if (!episode) {
    throw new HttpStatusCodeException(404, "Episode ${episodeId} not found")
}

return [ "entry": episode ]
