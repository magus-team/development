import { ConfigService } from 'nestjs-config'
import { GraphQLClient } from 'graphql-request'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MutationStatus, Client } from '@magus/types'

import { AppModule } from 'modules/app.module'
import { createDBIfNotExist } from 'common/utils/pg.utils'
import { TESTING_SERVER_PORT } from 'common/constants'

describe('Client Resolver (e2e)', () => {
    let app: NestFastifyApplication
    let graphQLClient: GraphQLClient
    let pwaClientId: string

    beforeAll(async () => {
        await createDBIfNotExist('magus-test-client')

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule.register('magus-test-client')],
        }).compile()

        app = moduleFixture.createNestApplication(new FastifyAdapter())
        const config = app.get(ConfigService)

        await app.init()
        await app.listen(TESTING_SERVER_PORT.CLIENT)

        pwaClientId = config.get('pwa.PWAClientId')

        graphQLClient = new GraphQLClient(`${await app.getUrl()}/graphql`, {
            headers: {
                'system-key': config.get('management.systemKey'),
            },
        })
    })

    afterAll(async () => {
        await app.close()
    })

    const initialPWAClientMutation = `
  mutation {
    initialPWAClient{
      ... on MutationStatus {
         isSucceeded
        message
      }
      ... on Client{
        id
        key
        deviceType
        createdAt
        updatedAt
        isWebApp
      }
    }
  }
  `

    it('should initial the PWA client into the database', async () => {
        const {
            initialPWAClient: [{ id, deviceType, isWebApp }],
        } = await graphQLClient.request<{ initialPWAClient: [Client] }>(initialPWAClientMutation)
        expect(id).toBe(pwaClientId)
        expect(deviceType).toBe('web')
        expect(isWebApp).toBe(true)
    })

    it('should do nothing when the PWA client has already been created', async () => {
        const {
            initialPWAClient: [{ message, isSucceeded }],
        } = await graphQLClient.request<{ initialPWAClient: [MutationStatus] }>(initialPWAClientMutation)
        expect(isSucceeded).toBe(false)
        expect(message).toBe('The system already have PWA client')
    })
})
