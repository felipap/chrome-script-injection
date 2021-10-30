
export async function getTab(): Promise<chrome.tabs.Tab> {
  return new Promise(accept => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
        // @ts-ignore
      },
      tabs => accept(tabs[0])
    )
  })
}
