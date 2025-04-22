import { z } from 'zod';

export const DatabaseConfigSchema = z.object({
  host: z.string().min(1, "Database host is required"),
  port: z.number().min(1).max(65535),
  database: z.string().min(1, "Database name is required"),
  user: z.string().min(1, "Database user is required"),
  password: z.string().min(1, "Database password is required"),
  ssl: z.boolean().default(false),
  maxConnections: z.number().min(1).default(10),
  connectionTimeout: z.number().min(1000).default(5000), // milliseconds
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export const defaultDatabaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'apidash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: 10,
  connectionTimeout: 5000,
};

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private config: DatabaseConfig;
  private pool: any; // Will be replaced with actual pool type

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public static getInstance(config?: DatabaseConfig): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      if (!config) {
        config = defaultDatabaseConfig;
      }
      DatabaseConnection.instance = new DatabaseConnection(config);
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      // Initialize connection pool
      const { Pool } = await import('pg');
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl,
        max: this.config.maxConnections,
        connectionTimeoutMillis: this.config.connectionTimeout,
      });

      // Test connection
      await this.pool.query('SELECT NOW()');
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('Database connection closed');
    }
  }
} 