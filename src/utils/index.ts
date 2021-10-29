/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

export function getBrowser(): typeof chrome {
  // Get extension api Chrome or Firefox
  const browserInstance = window.chrome || (window as any)['browser']
  return browserInstance
}

export const TOOL_COOKIES = {
  _fbc: 'Facebook',
  _fbp: 'Facebook',
  __adroll_fpc: 'Adroll',
  KL_FORMS_MODAL: 'Klaviyo',
  __kla_id: 'Klaviyo',
  _ps_session: 'Postscript.io',
}

// In a browser like Chrome, it's impossible even for an extension to
// distinguish between Http-set cookies and Javascript cookies (unless we
// monitor the server requests in the page and look for cookies being set (can
// we even do that?) to keep track of which are Http ones). So we're left with
// having to write a list of cookies and the third-party services that write
// them.
export function isItpRestrictedCookie(cookie: chrome.cookies.Cookie): boolean {
  if (cookie.httpOnly) {
    return false
  }

  if (cookie.name.startsWith('RESET_')) {
    return true
  }

  return cookie.name in TOOL_COOKIES
}