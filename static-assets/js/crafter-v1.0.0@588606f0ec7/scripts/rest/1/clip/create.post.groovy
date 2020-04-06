import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.exception.NoSuchRecordException
import org.craftercms.site.videocenter.utils.RequestUtils

try {
	def req = RequestUtils.getJson(request)

	def chId = req.channelId
	def programId = req.programId
	def episodeId = req.episodeId
	def clipTitle = req.title
	def clipDescription = req.description
	def clipStart = req.startTime
	def clipEnd = req.endTime

	def clip = applicationContext.clipService.createClip(chId,
		programId,
		episodeId,
		profile,
		clipTitle,
		clipDescription,
		clipStart,
		clipEnd)

	if(!clip) {
		throw new HttpStatusCodeException(500, "Error in creating clip")
	}
	
	return [
	    entry: clip
	]
} catch (NoSuchRecordException | IllegalStateException | IllegalArgumentException e) {
	throw new HttpStatusCodeException(400, e)
}
