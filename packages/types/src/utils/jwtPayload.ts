import { RoleType } from '../entities/userRole'

export type JWTPayload = {
    userId: string
    name: string
    roles: RoleType[]
    appId: string
    exp?: number
}
