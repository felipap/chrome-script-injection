import React, { useEffect, useState } from 'react'
import { Badge, Box } from 'theme-ui'
import { getConfigForHost, setConfigForHost } from '.'
import type { HostConfig } from '../background'
import { getTab } from '../utils'

const DEFAULT_URL = 'https://cdn.human.fan/cartwheel/dev-latest.js'

export function Popup() {
  const [config, setConfig] = useState<HostConfig | null>()

  useEffect(() => {
    async function load() {
      setConfig(await getConfigForHost())
    }
    load()
  }, [])

  async function onClickClear() {
    updateValueAndReload({ ...config, url: null })
  }

  async function onClickSet() {
    const url = prompt('Enter an URL to load', config?.url ?? DEFAULT_URL)

    const datasetStr = prompt(
      'Enter a dataset JSON value',
      config?.dataset ? JSON.stringify(config.dataset) : '{}'
    )

    let dataset
    try {
      dataset = JSON.parse(datasetStr)
    } catch (e) {
      alert('Failed to parse dataset JSON')
    }

    updateValueAndReload({ ...config, dataset, url: url ?? null })
  }

  async function updateValueAndReload(newConfig: typeof config) {
    setConfig(newConfig)
    await setConfigForHost(newConfig)
    const tab = await getTab()
    chrome.tabs.reload(tab.id)
  }

  return (
    <Box
      sx={{
        padding: '10px',
        fontSize: '14px',
        minWidth: '500px',
        section: {
          mb: '10px',
          flexDirection: 'column',
          display: 'flex',
          gap: '10px',
          h1: { fontSize: '18px', margin: 0 },
          h2: { fontSize: '12px', margin: 0, opacity: .6 },
          p: { margin: 0 },
        },
      }}
    >
      <section>
        {config?.url ? (
          <Badge sx={{ color: 'limegreen' }}>Active</Badge>
        ) : (
          <Badge sx={{ color: 'black' }}>Inactive</Badge>
        )}
      </section>

      <section>
        <h1>URL</h1>
        <p>{config?.url}</p>
      </section>

      <section>
        <h1>Dataset</h1>
        <h2>You can specify HTML dataset values to attach to the script tag we are injecting. Useful for scripts that need attributes like <code>data-writekey</code> to work.</h2>
        <p>{config?.dataset ? JSON.stringify(config.dataset) : '{}'}</p>
      </section>

      <section>
        <button onClick={onClickSet}>Set Value</button>
        <button onClick={onClickClear}>Clear</button>
      </section>

      <a
        href="https://github.com/felipap/sub-script-test-extension"
        target="_blank"
      >
        Learn more
      </a>
    </Box>
  )
}
