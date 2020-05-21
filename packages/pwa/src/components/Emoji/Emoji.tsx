import React from 'react'
import styled from 'styled-components'

type Props = {
  label?: string
  size?: 'large' | 'medium' | 'small'
  symbol: string
}

type ContentProps = {
  size: 'large' | 'medium' | 'small'
}

const sizeMap = {
  large: '3rem',
  medium: '2rem',
  small: '1rem',
}

const Content = styled('span')<ContentProps>`
  font-size: ${(props) => sizeMap[props.size]};
`

const Emoji: React.FC<Props> = ({ label, size = 'medium', symbol }) => (
  <Content
    role="img"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'} // if aria-hidden is true it will be ignored by the screen reader
    size={size}
  >
    {symbol}
  </Content>
)

export default Emoji
