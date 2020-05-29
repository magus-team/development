import { ConfigService } from 'nestjs-config'
import { GraphQLClient } from 'graphql-request'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MutationStatus } from '@magus/types'

import { AppModule } from 'modules/app.module'
import { createDBIfNotExist } from 'common/utils/pg.utils'
import { TESTING_SERVER_PORT } from 'common/constants'

describe('User Resolver (e2e)', () => {
    let app: NestFastifyApplication
    let graphQLClient: GraphQLClient

    beforeAll(async () => {
        await createDBIfNotExist('magus-test-user')

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule.register('magus-test-user')],
        }).compile()

        app = moduleFixture.createNestApplication(new FastifyAdapter())
        const config = app.get(ConfigService)
        config.set('pg.database', 'magus-test-user')

        await app.init()
        await app.listen(TESTING_SERVER_PORT.USER)

        graphQLClient = new GraphQLClient(`${await app.getUrl()}/graphql`, {
            headers: {
                'system-key': config.get('management.systemKey'),
            },
        })
    })

    afterAll(async () => {
        await app.close()
    })

    const initAdminUserMutation = `
    mutation {
      initAdminUser{
        isSucceeded
        message
      }
    }
  `

    it('should initial admin user based on the management.adminEmailAddress config', async () => {
        const {
            initAdminUser: { isSucceeded, message },
        } = await graphQLClient.request<{ initAdminUser: MutationStatus }>(initAdminUserMutation)
        expect(isSucceeded).toBe(true)
        expect(message).toBe('The administrator account has been created')
    })

    it('should get false when the admin user has already been created', async () => {
        const {
            initAdminUser: { isSucceeded, message },
        } = await graphQLClient.request<{ initAdminUser: MutationStatus }>(initAdminUserMutation)
        expect(isSucceeded).toBe(false)
        expect(message).toBe('The system already has an administrator account')
    })
})
