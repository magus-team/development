import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import baseConfiguration from './config/base'

const baseConfig = baseConfiguration()

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
    await app.listen(baseConfig.port, () => {
        console.warn(`The Graphql is available on ${baseConfig.graphqlEndpoint}`)
    })
}
bootstrap()
