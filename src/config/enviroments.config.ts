import {config} from 'dotenv'

config({path:'.env'});

export const POSTGRES_URL = process.env.POSTGRES_URL;