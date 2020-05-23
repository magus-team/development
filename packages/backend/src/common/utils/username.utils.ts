import { v4 } from 'uuid'

export const usernameBlacklist = [
    'login',
    'logout',
    'onboarding',
    'register',
    'search',
    'setting',
    'settings',
    'signup',
    'verify',
]

export const getRandomUsername = (): string => v4().replace(/\-/gi, '_')

export const getSuggestedUsername = (value: string) => value.replace(/\-/gi, '_').replace(/\./gi, '_')
