import React from 'react'

import { Container, Spinner, SpinnerContiner } from './styles'

type Props = {
  isLoading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

const Button: React.FC<Props> = ({
  children,
  isLoading,
  onClick,
  type = 'button',
}) => (
  <Container type={type} onClick={onClick}>
    {isLoading && (
      <SpinnerContiner>
        <Spinner viewBox="0 0 128 128">
          <path d="M75.4 126.6a11.4 11.4 0 0 1-2.1-22.6 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.3 4.9h0a63.8 63.8 0 0 1-47.8 48.1v0a11.4 11.4 0 0 1-2.9z" />
        </Spinner>
      </SpinnerContiner>
    )}
    {children}
  </Container>
)

export default Button
