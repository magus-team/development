import { Client } from 'pg'

import pg from 'config/pg'

export const createDBIfNotExist = async (databaseName = pg.database): Promise<void> => {
    const client = new Client({
        user: pg.username,
        password: pg.password,
        port: pg.port,
        host: pg.host,
    })

    await client.connect()

    const res = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${databaseName}')`,
    )
    if (!res.rows[0].exists) {
        await client.query(`CREATE DATABASE "${databaseName}"`)
    }
    await client.end()
}
