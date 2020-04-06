import org.craftercms.site.videocenter.utils.RequestUtils
import org.craftercms.site.videocenter.exception.NoSuchRecordException
import org.craftercms.engine.exception.HttpStatusCodeException

try {
    def req = RequestUtils.getJson(request)

    def searchConfig = req.searchConfig

    if(searchConfig && !(searchConfig instanceof Map)) {
        throw new HttpStatusCodeException(400, "Invalid searchConfig provided on request")
    }

    def countries = null
    def languages = null
    def topics = null
    def topicCountries = null

    if(searchConfig) {
        countries = searchConfig.countries
        languages = searchConfig.languages
        topics = searchConfig.topics
        topicCountries = searchConfig.topicCountries
    }

    return [
        entry: applicationContext.userService.updateUserPreferences(profile,
            req.timezone,
            countries,
            languages,
            topics,
            topicCountries)
    ]
} catch(NoSuchRecordException e) {
    throw new HttpStatusCodeException(404, "No user found for user id '${profile.username}'")
} catch (IllegalArgumentException e) {
    throw new HttpStatusCodeException(400, e)
}
