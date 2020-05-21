import React from 'react'

type Props = {
  label?: string
  symbol: string
}

const Emoji: React.FC<Props> = ({ label, symbol }) => (
  <span
    role="img"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'} // if aria-hidden is true it will be ignored by the screen reader
  >
    {symbol}
  </span>
)

export default Emoji
