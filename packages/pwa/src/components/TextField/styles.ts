import styled from 'styled-components'

import { colors } from 'utils/style/colors'
import { borderRadius } from 'utils/style/common'

type FocusProps = {
  isFocused: boolean
}

export const Label = styled('label')<FocusProps>`
  position: absolute;
  background: #fff;
  top: -13px;
  right: 10px;
  padding: 0px 5px;
  color: ${(props) => (props.isFocused ? colors.primary : colors.black)};
`

export const Wrapper = styled('div')<FocusProps>`
  border: 1px solid ${colors.black};
  border-radius: ${borderRadius};
  position: relative;
  display: inline-flex;
  justify-contnet: space-between;
  align-items: center;
  padding: 10px;
  margin: 1rem;
  border-color: ${(props) => (props.isFocused ? colors.primary : colors.black)};
`

export const Input = styled('input')`
  border: none;
`

export const ShowPwd = styled('span')`
  color: ${colors.gray};
  cursor: pointer;
  height: 1rem;
  & > svg {
    width: 1rem;
    height: 1rem;
  }
`
