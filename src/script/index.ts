import { installIndicator } from './Indicator'

chrome.runtime.sendMessage({}, function (response) {
  if (response.pleaseLoad.length === 0) {
    return
  }

  const scriptUrl = response.pleaseLoad[0]

  console.log('Background asked us to run', scriptUrl)
  console.log(response.pleaseLoad)

  // Modify script url to add random search parameter, to prevent caching.
  const url = new URL(scriptUrl)
  url.searchParams.set('cachekey', String(Math.floor(Math.random() * 10000)))

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = false
  script.src = url.href

  installIndicator(scriptUrl)

  const first = document.getElementsByTagName('script')[0]
  first.parentNode!.insertBefore(script, first)
})
