import { JWTPayload } from '@magus/types'

export class UserInfo {
    constructor(payload: JWTPayload) {
        this.userId = payload.userId
        this.name = payload.name
        this.roles = payload.roles
        this.appId = payload.appId
    }
    userId: string
    name: string
    roles: string[]
    appId: string
}
