import styled, { css } from 'styled-components'

import { colors } from 'utils/style/colors'
import { rotate } from 'utils/style/keyframes'

export const Container = styled('button')`
  background-color: ${colors.secondery};
  color: ${colors.black};
  padding: 0.7rem 1rem;
  border-radius: 1.7rem;
  cursor: pointer;
  min-width: 8rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`

const rotateAnimation = css`
  animation: ${rotate} 0.5s infinite linear;
`

export const SpinnerContiner = styled('div')`
  margin-left: 0.7rem;
`

export const Spinner = styled('svg')`
  width: 1rem;
  display: flex;
  position: relative;
  ${rotateAnimation};
  & path {
    fill: ${colors.black};
  }
`
