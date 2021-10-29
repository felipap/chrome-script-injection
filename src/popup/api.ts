/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

import uniqBy from 'lodash/uniqBy'

import * as psl from 'psl'
import { ParsedDomain } from 'psl'

export async function loadCookiesForTab(tab: chrome.tabs.Tab) {
  const tabUrl = new URL(tab.url)

  const stores = await chrome.cookies.getAllCookieStores()
  let storeId: string
  for (const store of stores) {
    if (store.tabIds.includes(tab.id)) {
      storeId = store.id
      break
    }
  }
  if (!storeId) {
    console.log('Cookie stores are', stores)
    throw Error('store with current tab not found.')
  }

  const directCookies = await chrome.cookies.getAll({
    domain: tabUrl.host,
  })
  console.log(`Cookies from store ${storeId}:`, directCookies)

  const parentDomain = (psl.parse(tabUrl.hostname) as ParsedDomain).domain

  const parentCookies = await chrome.cookies.getAll({ domain: parentDomain })
  console.log(`Cookies ${parentDomain}:`, parentCookies)

  return uniqBy(
    [...directCookies, ...parentCookies],
    c => `${c.name} ${c.domain}`
  )
}

export async function changeExpirationForCookie(
  tab: chrome.tabs.Tab,
  name: string,
  expiration: Date
) {
  const current = await chrome.cookies.get({ name, url: tab.url })
  if (!current) {
    throw Error(`Cookie ${name} not found for url ${tab.url}!`)
  }

  try {
    const url = `https://${current.domain.replace(/^\./, '')}`

    await chrome.cookies.set({
      name,
      domain: current.hostOnly ? undefined : current.domain,
      httpOnly: current.httpOnly,
      path: current.path,
      sameSite: current.sameSite,
      secure: current.secure,
      storeId: current.storeId,
      value: current.value,
      url,
      expirationDate: Math.floor(+expiration / 1000),
    })
    // alert('reset!')
  } catch (e) {
    // alert('failed')
  }
}
