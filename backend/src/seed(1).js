
// backend/src/seed.js
const { Client } = require("pg");

function clientConfig() {
  if (process.env.DATABASE_URL) return { connectionString: process.env.DATABASE_URL };
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "synergysphere",
  };
}

async function seed() {
  const client = new Client(clientConfig());
  try {
    await client.connect();
    console.log("✅ Connected to database for seeding...");

    // USERS
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        avatar TEXT,
        initials VARCHAR(10),
        role VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password TEXT
      );
    `);

    // PROJECTS (rich schema to match frontend expectations)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        progress INTEGER DEFAULT 0,
        members JSONB DEFAULT '[]'::jsonb,
        tasks_summary JSONB DEFAULT '{}'::jsonb,
        due_date DATE,
        status VARCHAR(32) DEFAULT 'active',
        priority VARCHAR(32) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // TASKS
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL
      );
    `);

    // MESSAGES
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(100),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // NOTIFICATIONS
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        body TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed users (id auto, dedupe on email)
    await client.query(`
      INSERT INTO users (name, avatar, initials, role, email, password)
      VALUES
        ('John Doe', '/placeholder.svg?height=32&width=32', 'JD', 'Admin', 'john@example.com', 'secret'),
        ('Mike Johnson', '/placeholder.svg?height=32&width=32', 'MJ', 'Developer', 'mike@example.com', 'secret'),
        ('Alex Rivera', '/placeholder.svg?height=32&width=32', 'AR', 'Designer', 'alex@example.com', 'secret')
      ON CONFLICT (email) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO projects (id, name, description, progress, members, tasks_summary, status, priority)
      VALUES
        (1, 'AI Assistant', 'AI-powered assistant for productivity', 45, '[]'::jsonb, '{"done":4,"total":10}'::jsonb, 'active', 'high'),
        (2, 'Flood Relief App', 'App to coordinate flood relief resources', 20, '[]'::jsonb, '{"done":2,"total":8}'::jsonb, 'planning', 'medium'),
        (3, 'Health Tracker', 'Track health and fitness goals', 70, '[]'::jsonb, '{"done":10,"total":15}'::jsonb, 'active', 'high'),
        (4, 'E-commerce Store', 'Simple online shopping platform', 10, '[]'::jsonb, '{"done":0,"total":5}'::jsonb, 'on-hold', 'low'),
        (5, 'Learning Platform', 'Online courses and tutorials platform', 55, '[]'::jsonb, '{"done":6,"total":12}'::jsonb, 'active', 'medium')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("🌱 Seeding complete!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await client.end();
  }
}

module.exports = seed;
