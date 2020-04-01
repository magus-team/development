import { SetMetadata } from '@nestjs/common'

import { RoleType } from '@magus/types'

/**
 * using like this
 * @Roles(RoleType.USER, RoleType.ADMINISTRATOR)
 * this decorator should be used by
 * @UseGuards(AuthGuard) it can be put upside of resolver or controller or method
 *
 * @param roles
 */
export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles)
