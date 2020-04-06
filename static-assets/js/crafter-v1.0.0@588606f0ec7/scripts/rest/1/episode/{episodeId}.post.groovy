import org.craftercms.site.videocenter.exception.UnauthorizedException
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.utils.RequestUtils

def episodeId = pathVars.episodeId

try {
    def req = RequestUtils.getJson(request)

    //all args are optional - only non-null values will be changed
    def episodeName = req.title
    def episodeDescription = req.description
    def episodeUrl = req.url

    def episode = applicationContext.episodeService.updateEpisode(profile,
        episodeId,
        episodeName,
        episodeDescription,
        episodeUrl)

    if(!episode) {
        throw new HttpStatusCodeException(404, "Episode not found")
    }

    return [
        entry: episode
    ]
} catch (IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
