import { ConfigService } from 'nestjs-config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from 'modules/app.module'
import { createDBIfNotExist } from 'common/utils/pg.utils'

async function bootstrap() {
    await createDBIfNotExist()
    const app = await NestFactory.create<NestFastifyApplication>(AppModule.register(), new FastifyAdapter())
    const config = app.get(ConfigService)

    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    await app.listen(config.get('server.port'), () => {
        console.warn(`The Graphql is available on ${config.get('server.graphqlEndpoint')}`)
    })
}
bootstrap()
