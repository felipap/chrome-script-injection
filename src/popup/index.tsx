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

  async function onClickToggle() {
    let newConfig = { ...config }
    if (config.on) {
      newConfig.on = false
    } else {
      newConfig.on = true
    }
    setConfig(newConfig)
    await setConfigForHost(newConfig)
    const tab = await getTab()
    chrome.tabs.reload(tab.id)
  }

  return (
    <Box>
      Hi!
      <button onClick={onClickToggle}>Toggle</button>
      <br />
      <pre>{JSON.stringify(config)}</pre>
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
