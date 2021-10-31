import React from 'react'
import ReactDOM from 'react-dom'
import type { HostConfig } from '../background'
import { getTab } from '../utils'
import { Popup } from './Popup'

ReactDOM.render(<Popup />, document.getElementById('mount'))

export async function getConfigForHost(): Promise<HostConfig | null> {
  // @ts-ignore
  const tab = await getTab()
  const tabHost = new URL(tab.url!).hostname

  return new Promise(accept => {
    console.log('sending message!')

    chrome.runtime.sendMessage(
      { type: 'getConfigForHost', host: tabHost },
      response => {
        accept(response.config)
      }
    )
  })
}

export async function setConfigForHost(config: HostConfig) {
  // @ts-ignore
  const tab = await getTab()
  const tabHost = new URL(tab.url!).hostname

  return new Promise(accept => {
    chrome.runtime.sendMessage(
      { type: 'setConfigForHost', host: tabHost, config },
      response => {
        console.log('reponse is what', response)
        accept(response.config)
      }
    )
  })
}
