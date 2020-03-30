import { ConfigModule } from '@nestjs/config'

import base from './base'

export default ConfigModule.forRoot({
    load: [base],
    isGlobal: true,
})
