import { installIndicator } from './Indicator'

chrome.runtime.sendMessage({}, function (response) {
  if (response.pleaseLoad.length === 0) {
    return
  }

  const scriptUrl = response.pleaseLoad[0]

  console.log('Background asked us to run', scriptUrl)
  console.log(response.pleaseLoad)

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = false
  script.src = scriptUrl

  installIndicator(scriptUrl)

  const first = document.getElementsByTagName('script')[0]
  first.parentNode!.insertBefore(script, first)
})
