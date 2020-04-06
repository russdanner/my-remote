import org.craftercms.engine.exception.HttpStatusCodeException

def clipId = pathVars.clipId

def clip = applicationContext.clipService.getClip(clipId)

if (!clip) {
    throw new HttpStatusCodeException(404, "Clip ${clipId} not found")
}

return [ entry: clip ]
