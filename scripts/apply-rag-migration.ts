import fs from 'node:fs/promises';import path from 'node:path';import { neon } from '@neondatabase/serverless';
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL required');
const sql=neon(process.env.DATABASE_URL,{fullResults:true});
const migration=await fs.readFile(path.join(process.cwd(),'db/migrations/0002_rag_vector_graph.sql'),'utf8');
await sql.query(migration,[]);console.log('0002_rag_vector_graph applied');
