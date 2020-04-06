import org.craftercms.engine.exception.HttpStatusCodeException

def programId = pathVars.programId

def program = applicationContext["programService"].getProgram(programId)

if (!program) {
    throw new HttpStatusCodeException(404, "Program with programId ${programId} not found")
}

return [
	entry: program
]