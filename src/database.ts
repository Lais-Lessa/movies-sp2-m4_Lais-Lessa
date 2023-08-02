import { Client } from "pg";
import {config} from 'dotenv'

config();

const client: Client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB,
    port: Number(process.env.DB_PORT)
})

const startDatabase = async () => {
    try{
        await client.connect()
        console.log('Database connected')
    }catch(error) {
        console.error(error, "Database is not connected!")
    }
}

export { client, startDatabase}