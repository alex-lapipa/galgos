import path from 'node:path';
import { spawnSync } from 'node:child_process';

function main(){
  if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL required');
  const migration=path.join(process.cwd(),'db/migrations/0002_rag_vector_graph.sql');
  const result=spawnSync('psql',[process.env.DATABASE_URL,'-v','ON_ERROR_STOP=1','-f',migration],{stdio:'inherit'});
  if(result.error)throw new Error(`Unable to start psql: ${result.error.message}`);
  if(result.status!==0)throw new Error(`psql migration failed with exit code ${result.status}`);
  console.log('0002_rag_vector_graph applied');
}

try{main()}catch(error){console.error(error instanceof Error?error.message:'Migration failed');process.exitCode=1}
