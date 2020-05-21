import React from 'react'
import styled from 'styled-components'
import { colors } from 'utils/style/colors'

type Props = {
  onClick?: () => void
  type?: 'button' | 'submit'
}

const Container = styled('button')`
  background-color: ${colors.secondery};
  color: ${colors.black};
  padding: 0.7rem 1rem;
  margin: 0.5rem;
  border-radius: 1.7rem;
  cursor: pointer;
  min-width: 8rem;
  font-weight: bold;
`

const Button: React.FC<Props> = ({ children, onClick, type = 'button' }) => (
  <Container type={type} onClick={onClick}>
    {children}
  </Container>
)

export default Button
