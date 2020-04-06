def timeout = applicationContext.signedCookieService.setSignedCookies(response,
    profile.username,
    request,
    true)

return [
    expires: timeout
]
