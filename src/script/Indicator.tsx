import React from 'react'
import ReactDOM from 'react-dom'
import { Box } from 'theme-ui'

function Indicator({ url }: { url: string }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        padding: '20px',
        background: 'white',
        zIndex: 100,
        boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
      }}
      title={url}
    >
      Script injection is active
    </Box>
  )
}

export function installIndicator(url: string) {
  const mount = document.createElement('div')
  document.body.appendChild(mount)
  ReactDOM.render(<Indicator url={url} />, mount)
}
