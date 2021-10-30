import { HostConfig } from '.'

const HOST_CONFIG_KEY = 'host-configs'

export async function getConfigForHost(host: string): Promise<HostConfig | null> {
  return new Promise(accept => {
    chrome.storage.local.get([HOST_CONFIG_KEY], result => {
      const hostConfigs = result[HOST_CONFIG_KEY]
      if (!hostConfigs) {
        accept(null)
        return
      }

      accept(hostConfigs[host] ?? null)
    })
  })
}

export async function setConfigForHost(
  host: string,
  config: HostConfig
): Promise<void> {
  return new Promise<void>(accept => {
    chrome.storage.local.get([HOST_CONFIG_KEY], result => {
      const hostConfigs = result[HOST_CONFIG_KEY] ?? null

      const newValue = {
        ...hostConfigs,
        [host]: config,
      }

      chrome.storage.local.set({ [HOST_CONFIG_KEY]: newValue }, () => {
        accept()
      })
    })
  })
}
