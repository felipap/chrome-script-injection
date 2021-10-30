/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

import { getConfigForHost, setConfigForHost } from './storage'

export interface HostConfig {
  url: string | null
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
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension',
    request
  )
  if (sender.tab) {
    console.log('Sending response back')
    getScriptsForTab(sender.tab!).then(scripts => {
      chrome.browserAction.setBadgeText({
        text: scripts.length ? 'ON' : '',
        tabId: sender.tab!.id,
      })
      sendResponse({ pleaseLoad: scripts })
    })
  } else if (request.type === 'getConfigForHost') {
    getConfigForHost(request.host).then(config => {
      console.log('Nooow we can send a response')
      sendResponse({ config })
    })
  } else if (request.type === 'setConfigForHost') {
    setConfigForHost(request.host, request.config)
    sendResponse({ success: true })
  }

  return true
})

async function getScriptsForTab(tab: chrome.tabs.Tab): Promise<string[]> {
  const url = new URL(tab.url!)

  if (url.protocol !== 'https:') {
    return []
  }

  const config = await getConfigForHost(url.hostname)
  console.log('config for this store is', config)

  if (!config || !config.url) {
    return []
  }

  return [config.url]
}
