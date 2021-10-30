import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import type { HostConfig } from '../background'
import { Box } from 'theme-ui'
import { getTab } from '../utils'

function App() {
  const [config, setConfig] = useState<HostConfig | null>()

  useEffect(() => {
    async function load() {
      setConfig(await getConfigForHost())
    }
    load()
  }, [])

  async function onClickClear() {
    updateValueAndReload({ url: null })
  }

  async function onClickSet() {
    const url = prompt(
      'Enter an URL to load',
      'https://storage.googleapis.com/human-static/cartwheel/dev-latest.js'
    )
    updateValueAndReload({ url: url ?? null })
  }

  async function updateValueAndReload(newConfig: typeof config) {
    setConfig(newConfig)
    await setConfigForHost(newConfig)
    const tab = await getTab()
    chrome.tabs.reload(tab.id)
  }

  return (
    <Box>
      url: {config?.url}
      <br />
      <button onClick={onClickSet}>Set</button>
      <button onClick={onClickClear}>Clear</button>
    </Box>
  )
}

ReactDOM.render(<App />, document.getElementById('mount'))

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
