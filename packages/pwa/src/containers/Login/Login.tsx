import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Twitter, Instagram } from 'react-feather'

import messages from './messages'
import {
  Actions,
  ForgetPWD,
  SocialButton,
  SocialLogins,
  ThinLayout,
} from './styles'
import Emoji from 'components/Emoji'
import TextField from 'components/TextField'
import Button from 'components/Button'

type Inputs = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const { handleSubmit, register, errors } = useForm<Inputs>()
  const onSubmit = (values: Record<string, any>) => {
    console.info(values)
  }
  return (
    <ThinLayout>
      <Emoji symbol="🚀" label="rocket" size="large" />
      <h1>{messages.login}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          id="email"
          name="email"
          label={messages.email}
          placeholder={messages.enterYourEmail}
          ref={register({
            required: messages.required,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: messages.enteredEmailAddressIsNotValid,
            },
          })}
          error={errors.email ? errors.email.message : undefined}
        />
        <TextField
          type="password"
          id="password"
          name="password"
          label={messages.password}
          placeholder={messages.enterYourPassword}
          ref={register({
            required: messages.required,
            minLength: {
              value: 6,
              message: messages.passwordLengthShouldBeAtLeastSixLetters,
            },
          })}
          error={errors.password ? errors.password.message : undefined}
        />
        <Actions>
          <Button type="submit">{messages.enter}</Button>
          <Link to="signup">{messages.orSignup}</Link>
        </Actions>
        <ForgetPWD to="forget-password">{messages.forgetPassword}</ForgetPWD>
      </form>
      <SocialLogins>
        <SocialButton color="blue">
          <Twitter />
          {messages.loginWithTwitter}
        </SocialButton>
        <SocialButton color="pink">
          <Instagram />
          {messages.loginWithInstagram}
        </SocialButton>
      </SocialLogins>
    </ThinLayout>
  )
}

export default Login
