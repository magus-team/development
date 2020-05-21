import React from 'react'
import { Eye, EyeOff } from 'react-feather'

import { Input, Label, ShowPwd, Wrapper } from './styles'

type Props = {
  disabled?: string
  error?: string
  id: string
  label: string
  placeholder: string
  required?: boolean
  type: 'text' | 'number' | 'email' | 'password' | 'url'
}

const TextField: React.FC<Props> = ({
  disabled,
  error,
  id,
  label,
  placeholder,
  required,
  type,
}) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [isFocused, setIsFocused] = React.useState<boolean>(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const onFocusChange = () => {
    setIsFocused(!isFocused)
  }
  return (
    <Wrapper aria-labelledby={`${id}-label`} isFocused={isFocused}>
      <Label htmlFor={id} id={`${id}-label`} isFocused={isFocused}>
        {label}
      </Label>
      <Input
        type={showPassword ? 'text' : type}
        id={id}
        aria-invalid={!!error}
        placeholder={placeholder}
        required={required}
        onFocus={onFocusChange}
        onBlur={onFocusChange}
      />
      {type === 'password' && (
        <ShowPwd
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </ShowPwd>
      )}
    </Wrapper>
  )
}

export default TextField
