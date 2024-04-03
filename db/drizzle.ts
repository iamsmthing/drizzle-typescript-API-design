import 'dotenv/config'
import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';
import { drizzle } from 'drizzle-orm/neon-http';
console.log(process.env.NEON_DATABASE_URL!)
const sql = neon(process.env.NEON_DATABASE_URL!);


const db = drizzle(sql,{ schema: schema });
export default db