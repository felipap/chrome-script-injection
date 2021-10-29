import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Button } from 'theme-ui'
import { changeExpirationForCookie, loadCookiesForTab } from './api'
import { CookieTable } from './Table'

function App() {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([])
  const [reset, setReset] = useState(0)

  useEffect(() => {
    async function load() {
      const tab = await getTab()
      setCookies(await loadCookiesForTab(tab))
    }
    load()
  }, [reset])

  async function onClickSkipDay() {
    const tab = await getTab()

    alert(`About to skip ahead for ${cookies.length}`)

    for (const cookie of cookies) {
      await changeExpirationForCookie(
        tab,
        cookie.name,
        cookie.expirationDate
        // Expire 25 hours, actually!
          ? new Date((cookie.expirationDate - 25 * 60 * 60) * 1000)
          : new Date(0)
      )
    }

    setReset(reset + 1)
  }

  return (
    <Box>
      <Button sx={{ bg: 'blue' }} onClick={onClickSkipDay}>
        Skip one day
      </Button>
      <CookieTable cookies={cookies} reset={() => setReset(reset + 1)} />
    </Box>
  )
}

ReactDOM.render(<App />, document.getElementById('mount'))

export async function getTab() {
  return (
    await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
  )[0]
}
