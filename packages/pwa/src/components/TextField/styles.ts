import styled from 'styled-components'

import { colors } from 'utils/style/colors'
import { borderRadius } from 'utils/style/common'

type FocusProps = {
  isFocused: boolean
  hasError: boolean
}
export const Wrapper = styled('div')`
  margin: 2rem 0;
  position: relative;
`

export const Label = styled('label')`
  position: absolute;
  background: #fff;
  top: -13px;
  right: 10px;
  padding: 0px 5px;
`

export const InputWrapper = styled('div')<FocusProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid ${colors.black};
  border-radius: ${borderRadius};
  position: relative;
  & > input {
    flex: 1;
  }
  ${(props) =>
    props.isFocused &&
    `border-color: ${colors.primary}; & ${Label} { color: ${colors.primary}}`}
  ${(props) =>
    props.hasError &&
    `border-color: ${colors.red}; & ${Label} { color: ${colors.red}}`}
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

export const ErrorMessage = styled('span')`
  color: ${colors.red};
  font-size: 0.7rem;
  position: absolute;
  right: 0;
`
