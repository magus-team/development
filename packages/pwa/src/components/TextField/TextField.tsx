import React, { Fragment } from 'react'
import { Eye, EyeOff } from 'react-feather'
import { FieldError } from 'react-hook-form'


import { ErrorMessage, Input, InputWrapper, Label, ShowPwd, Wrapper } from './styles'

type Props = {
  error?: FieldError['message']
  id: string
  label: string
  name: string
  placeholder: string
  ref: any
  type: 'text' | 'number' | 'email' | 'password' | 'url'
}

const TextField: React.FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  ({ error, id, label, name, placeholder, type }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }
    const onFocusChange = () => {
      setIsFocused(!isFocused)
    }
    return (
      <Wrapper>
        <InputWrapper
          aria-labelledby={`${id}-label`}
          isFocused={isFocused}
          hasError={!!error}
        >
          <Label
            htmlFor={id}
            id={`${id}-label`}
          >
            {label}
          </Label>
          <Input
            id={id}
            aria-invalid={!!error}
            aria-describedby={`error-${id}`}
            name={name}
            onFocus={onFocusChange}
            onBlur={onFocusChange}
            placeholder={placeholder}
            ref={ref}
            type={showPassword ? 'text' : type}
          />
          {type === 'password' && (
            <ShowPwd
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </ShowPwd>
          )}
        </InputWrapper>
        {error && (
          <ErrorMessage role="alert" id={`error-${id}`}>
            {error}
          </ErrorMessage>
        )}
      </Wrapper>
    )
  },
)

export default TextField
