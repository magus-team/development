import { ConfigService } from 'nestjs-config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from 'modules/app.module'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    const config = app.get(ConfigService)

    await app.listen(config.get('server.port'), () => {
        console.warn(`The Graphql is available on ${config.get('server.graphqlEndpoint')}`)
    })
}
bootstrap()
