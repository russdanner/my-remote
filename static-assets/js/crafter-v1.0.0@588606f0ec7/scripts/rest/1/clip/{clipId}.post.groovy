import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.utils.RequestUtils

def clipId = pathVars.clipId

try {
    def req = RequestUtils.getJson(request)

    //all args are optional - only non-null values will be changed
    def clipTitle = req.title as String
    def clipDescription = req.description as String
    def clipTranscription = req.transcription as String
    def clipUrl = req.url as String

    def clip = applicationContext.clipService.modifyClip(clipId,
        clipTitle,
        clipDescription,
        clipTranscription,
        clipUrl,
        profile)

    if(!clip) {
        throw new HttpStatusCodeException(404, "no clip found")
    }

    return [
    	entry: clip
    ]
} catch (IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
