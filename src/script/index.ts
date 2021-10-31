import { installIndicator } from './Indicator'

const LOG_PREFIX = [
  '%c SUB-SCRIPT-TEST-EXTENSION:',
  'color: blue; font-weight: bold',
]

chrome.runtime.sendMessage({}, function ({ config }) {
  if (!config?.url) {
    console.log(...LOG_PREFIX, 'No scripts to load.')
    return
  }

  console.log(
    ...LOG_PREFIX,
    'Background asked us to run',
    config.url,
    config.dataset
  )

  // Modify script url to add random search parameter, to prevent caching.
  const url = new URL(config.url)
  url.searchParams.set('cachekey', String(Math.floor(Math.random() * 10000)))

  console.log(...LOG_PREFIX, `script ${url.href} injected.`)

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = false
  script.src = url.href

  if (config.dataset) {
    for (const [key, value] of Object.entries(config.dataset)) {
      // @ts-ignore
      script.dataset[key] = value
    }
    console.log(...LOG_PREFIX, 'Added dataset values to object.')
  }

  const first = document.getElementsByTagName('script')[0]
  first.parentNode!.insertBefore(script, first)

  // Show indicator component on the page to show the script is on.
  installIndicator(config.url)
})
