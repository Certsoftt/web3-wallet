import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

export const db = new pg.Client({
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD.replace(
        "<lastpart>",
        process.env.PASS
    ),
    database:process.env.DBNAME,
    host:process.env.DBHOST,
    port:process.env.DBPORT
})