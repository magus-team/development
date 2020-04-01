export type JWTPayload = {
    userId: string
    name: string
    roles: string[]
    appId: string
    exp?: number
}
