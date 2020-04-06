// set signed cookies so they are initially available to all playback pages upon page load
applicationContext.signedCookieService.setSignedCookies(response,
    profile.username,
    request)

filterChain.doFilter(request, response)
