import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import sortBy from 'lodash/sortBy'
import React from 'react'
import { Box, Button } from 'theme-ui'
import { getTab } from '.'
import { isItpRestrictedCookie, TOOL_COOKIES } from '../utils'
import { changeExpirationForCookie } from './api'

dayjs.extend(relativeTime)

interface Props {
  cookies: chrome.cookies.Cookie[]
  reset: () => void
}

export function CookieTable({ cookies, reset }: Props) {
  const els = sortBy(cookies, c => c.expirationDate).map(cookie => {
    async function onClickExpire() {
      alert(`Expiring ${cookie.name} with value ${cookie.value}`)

      const tab = await getTab()

      await changeExpirationForCookie(
        tab,
        cookie.name,
        // dayjs().add(1, 'day').toDate()
        dayjs().toDate()
      )

      reset()
    }

    const isItpCookie = cookie.name in TOOL_COOKIES

    return (
      <Box
        as={'tr'}
        sx={{
          background: isItpCookie ? 'grey' : 'transparent',
        }}
      >
        <td style={{ width: '100px' }}>{cookie.name.slice(0, 30)}</td>
        <td>{cookie.domain}</td>
        <td>{cookie.value.slice(0, 20)}</td>
        <td>
          {cookie.expirationDate
            ? dayjs(cookie.expirationDate * 1000).fromNow()
            : 'No expiration'}
        </td>
        <td>{cookie.httpOnly ? 'True' : 'False'}</td>
        <td>{cookie.hostOnly ? 'True' : 'False'}</td>
        <td>
          <Button sx={{ bg: 'black' }} onClick={onClickExpire}>
            Expire
          </Button>
        </td>
      </Box>
    )
  })
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Domain</th>
            <th>Value</th>
            <th>Expiration Date</th>
            <th>httpOnly</th>
            <th>hostOnly</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{els}</tbody>
      </table>
    </div>
  )
}
