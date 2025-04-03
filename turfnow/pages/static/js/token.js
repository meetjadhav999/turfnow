function getCSRFToken() {
    const name = "csrftoken=";
    const decodedCookies = decodeURIComponent(document.cookie).split(';');
    for (let cookie of decodedCookies) {
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
        if (cookie.indexOf(name) === 0) return cookie.substring(name.length, cookie.length);
    }
    return "";
}