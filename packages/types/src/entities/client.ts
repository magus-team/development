import { BaseEntity, Entity, PrimaryColumn, Column, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from '@nestjs/graphql'

import { TrustedUserApp } from './trustedUserApp'

@ObjectType('Client')
@Entity('client')
export class Client extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn('uuid', { generated: 'uuid' })
    id: string

    @Field()
    @Column()
    key: string

    @Field()
    @Column({ name: 'is_web_app' })
    isWebApp: boolean

    @Field()
    @Column({ name: 'device_type' })
    deviceType: string

    @Field()
    @Column({ type: 'timestamp', name: 'created_at', default: new Date() })
    createdAt: Date

    @Field()
    @Column({ type: 'timestamp', name: 'updated_at', default: new Date() })
    updatedAt: Date

    @OneToMany(
        () => TrustedUserApp,
        (trustedUserApp) => trustedUserApp.client,
    )
    trustedUserApps: TrustedUserApp[]
}
