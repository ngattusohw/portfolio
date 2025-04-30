import pg from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import path from 'path';

// Configure Neon to use WebSockets
pg.neonConfig.webSocketConstructor = ws;
const { Pool } = pg;

// Create the migration SQL for sessions table
const sessionsTableMigration = `
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);
`;

// Create the migration SQL for users table
const usersTableMigration = `
-- Drop the old users table constraints and references
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_pkey;

-- Create temporary table for users
CREATE TABLE IF NOT EXISTS users_new (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  bio TEXT,
  profile_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Run migrations
DROP TABLE IF EXISTS users;
ALTER TABLE IF EXISTS users_new RENAME TO users;
`;

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('Connected to database');
  
  try {
    // Run the migrations
    console.log('Running sessions table migration...');
    await pool.query(sessionsTableMigration);
    
    console.log('Running users table migration...');
    await pool.query(usersTableMigration);
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migrations
runMigrations().catch(console.error);