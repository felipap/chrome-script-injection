import chalk from 'chalk'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { isItpRestrictedCookie } from './utils'

dayjs.extend(relativeTime)

console.log('Background is running!')

onInit()
chrome.cookies.onChanged.addListener(onCookieChange)

// chrome.alarms.create({ delayInMinutes: 3 });

// chrome.alarms.onAlarm.addListener(() => {
//   chrome.action.setIcon({
//     path: getRandomIconPath(),
//   });
// });

async function onInit() {
  const cookies = await chrome.cookies.getAll({
    url: 'https://store.human.fan',
  })

  for (const cookie of cookies) {
    if (!isItpRestrictedCookie(cookie)) {
      continue
    }

    console.log(
      `%c cookie ${cookie.name} ${cookie.domain} ${
        cookie.expirationDate
          ? dayjs(cookie.expirationDate * 1000).fromNow()
          : ''
      }`,
      'color: blue'
    )
    await capCookieExpirationIfRequired(cookie)
  }
}

async function onCookieChange({
  cookie,
  removed,
  cause,
}: chrome.cookies.CookieChangeInfo) {
  if (!isItpRestrictedCookie(cookie)) {
    return
  }

  if (removed) {
    console.log(`removed ${cookie.name} ${cookie.value.slice(0, 20)}`)
    // Cookie was removed. Nothing to do until it's added again.
    return
  }

  console.log(
    `%c\n\n\nCOOKIE CHANGE ${cookie.name} ${cookie.value.slice(0, 20)} ${
      cookie.domain
    } removed=${removed}`,
    'color: red',
    cookie,
    cause
  )

  await capCookieExpirationIfRequired(cookie)
}

async function capCookieExpirationIfRequired(cookie: chrome.cookies.Cookie) {
  if (!cookie.expirationDate) {
    // Cookie is a session cookie. Won't need fixing.
    return
  }

  const expires = new Date(cookie.expirationDate * 1000)
  const tomorrow = dayjs().add(1, 'day').toDate()

  // Subtract five minutes for tolerance.
  const expiresWithinADay = dayjs(expires)
    .subtract(5, 'minutes')
    .isBefore(tomorrow)
  if (expiresWithinADay) {
    console.log(
      `Doesn't expire after an ITP-restricted cookie would. Possibly the result of our own reset.`
    )
    return
  }

  console.log(
    `Expires ${dayjs(expires).fromNow()} expires=${expires} (${cookie.domain})`
  )

  const url = `https://${cookie.domain.replace(/^\./, '')}`
  const identifier = Math.floor(Math.random() * 100)

  try {
    console.log(`${identifier} - Will reset ${cookie.name}`)

    await chrome.cookies.set({
      name: cookie.name,
      // name: 'RESET_' + cookie.name + '_' + cookie.domain,
      domain: cookie.hostOnly ? undefined : cookie.domain,
      httpOnly: cookie.httpOnly,
      path: cookie.path,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      storeId: cookie.storeId,
      value: cookie.value,
      url,
      expirationDate: Math.floor(+tomorrow / 1000),
    })

    console.log(`${identifier} - Has reset ${cookie.name}`)
  } catch (e) {
    console.log('failed with error', e)
  }
}
