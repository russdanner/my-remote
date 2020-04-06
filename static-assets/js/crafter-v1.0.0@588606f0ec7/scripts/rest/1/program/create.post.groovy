import org.craftercms.site.videocenter.exception.UnauthorizedException
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.utils.RequestUtils

try {
	def req = RequestUtils.getJson(request)

	def chId = req.channelId
	def programName = req.title
	def programDescription = req.description
	def programStart = req.start
	def programEnd = req.end
	def saved = req.saved
	def frequency = req.frequency
	def endDate = req.saveEndDate

	def program = applicationContext.programService.createProgram(profile,
		chId,
		programName,
		programDescription,
		programStart,
		programEnd,
		saved,
		frequency,
		endDate)

	if(!program) {
		throw new HttpStatusCodeException(500, "Error in creating program")
	}

	return [
		entry: program
	]
} catch(UnauthorizedException e) {
	throw new HttpStatusCodeException(403, e.getMessage())
} catch(IllegalArgumentException e) {
	throw new HttpStatusCodeException(400, e)
}
