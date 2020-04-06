import org.craftercms.site.videocenter.exception.UnauthorizedException
import org.craftercms.engine.exception.HttpStatusCodeException
import org.craftercms.site.videocenter.utils.RequestUtils

def programId = pathVars.programId

try {
    def req = RequestUtils.getJson(request)

    // required args (null is a valid value)
    def endDate = req.saveEndDate

    //all other args are optional - only non-null values will be changed
    def programName = req.title as String
    def programDescription = req.description as String
    def programStart = req.start
    def programEnd = req.end
    def saved = req.saved
    def frequency = req.frequency

    def program = applicationContext.programService.updateProgram(profile,
        programId,
        programName,
        programDescription,
        programStart,
        programEnd,
        saved,
        frequency,
        endDate)

    if(!program) {
        throw new HttpStatusCodeException(404, "no program found")
    }

    return [
        entry: program
    ]
} catch(UnauthorizedException e) {
    throw new HttpStatusCodeException(403, e.getMessage())
} catch(IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
