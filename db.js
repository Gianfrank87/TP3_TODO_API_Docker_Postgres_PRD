/**
 * Pool de conexiones a PostgreSQL.
 * La configuracion se toma exclusivamente de variables de entorno.
 */

import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
})

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Conectado a Postgres'))
    .catch((err) => console.error('❌ No se pudo conectar a Postgres:', err.message))
