/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

import { getConfigForHost, setConfigForHost } from './storage'

export interface HostConfig {
  url: string | null
  dataset?: any | null
}

// It seems that the only way to load a custom, remote script in the front-end
// is to pass the message about what it is to the front-end and then to the
// whole document.createElement() thing.

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete') {
//   }
// })

// This must not be async so that this solution can work
// https://stackoverflow.com/questions/14094447
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.tab) {
    getActiveConfigForTab(sender.tab!).then(config => {
      chrome.browserAction.setBadgeText({
        text: config? 'ON' : '',
        tabId: sender.tab!.id,
      })

      if (!config) {
        sendResponse({ config })
        return
      }

      sendResponse({ config })
    })
  } else if (request.type === 'getConfigForHost') {
    getConfigForHost(request.host).then(config => {
      sendResponse({ config })
    })
  } else if (request.type === 'setConfigForHost') {
    setConfigForHost(request.host, request.config)
    sendResponse({ success: true })
  }

  return true
})

async function getActiveConfigForTab(
  tab: chrome.tabs.Tab
): Promise<HostConfig | null> {
  const url = new URL(tab.url!)

  if (url.protocol !== 'https:') {
    return null
  }

  const config = await getConfigForHost(url.hostname)

  if (!config || !config.url) {
    return null
  }

  return config
}
