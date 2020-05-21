import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { size } from 'utils/style/responsive'
import { colors } from 'utils/style/colors'
import { allEaseTransition } from 'utils/style/common'

type SocialButtonProps = {
  color: 'blue' | 'pink'
}

export const ThinLayout = styled('div')`
  max-width: ${size.tablet}px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  position: relative;
`

export const Actions = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

export const ForgetPWD = styled(Link)`
  color: ${colors.gray};
  transition: ${allEaseTransition};
  :hover {
    color: ${colors.primary};
  }
`

export const SocialLogins = styled('div')`
  background-color: ${colors.primary};
  padding: 2rem;
  border-top-right-radius: 2rem;
  border-top-left-radius: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

export const SocialButton = styled('button')<SocialButtonProps>`
  background-color: #ffffff;
  border-radius: 1rem;
  color: ${(props) => (props.color === 'blue' ? colors.blue : colors.pink)};
  padding: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  & > svg {
    margin-left: 0.5rem;
  }
`
