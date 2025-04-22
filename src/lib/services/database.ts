import { DatabaseConnection } from "../config/database";
import { z } from "zod";

// Schema for API definitions
export const ApiDefinitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  config: z.record(z.any()),
  status: z.enum(['draft', 'published', 'deprecated']),
  gatewayType: z.enum(['tyk', 'kong']),
});

export type ApiDefinition = z.infer<typeof ApiDefinitionSchema>;

// Schema for API keys
export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  apiId: z.string().uuid(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  status: z.enum(['active', 'revoked', 'expired']),
  permissions: z.array(z.string()),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export class DatabaseService {
  private static instance: DatabaseService;
  private db: DatabaseConnection | null = null;
  private isConnected: boolean = false;
  private inMemoryData: {
    apiDefinitions: ApiDefinition[];
    apiKeys: ApiKey[];
  } = {
    apiDefinitions: [],
    apiKeys: [],
  };

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const config = localStorage.getItem('databaseConfig');
      if (config) {
        const dbConfig = JSON.parse(config);
        this.db = DatabaseConnection.getInstance(dbConfig);
        await this.db.connect();
        this.isConnected = true;
        await this.initializeDatabase();
      }
    } catch (error) {
      console.warn('Failed to connect to database, running in memory mode:', error);
      this.isConnected = false;
    }
  }

  private async initializeDatabase(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.db?.query(`
        CREATE TABLE IF NOT EXISTS api_definitions (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          version VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
          config JSONB NOT NULL,
          status VARCHAR(20) NOT NULL,
          gateway_type VARCHAR(20) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS api_keys (
          id UUID PRIMARY KEY,
          api_id UUID NOT NULL REFERENCES api_definitions(id),
          key VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE,
          status VARCHAR(20) NOT NULL,
          permissions JSONB NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_api_keys_api_id ON api_keys(api_id);
        CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
      `);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      this.isConnected = false;
    }
  }

  // API Definition Operations
  public async createApiDefinition(api: Omit<ApiDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiDefinition> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newApi: ApiDefinition = {
      ...api,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (this.isConnected) {
      await this.db?.query(
        `INSERT INTO api_definitions (id, name, description, version, created_at, updated_at, config, status, gateway_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newApi.id,
          newApi.name,
          newApi.description,
          newApi.version,
          newApi.createdAt,
          newApi.updatedAt,
          JSON.stringify(newApi.config),
          newApi.status,
          newApi.gatewayType,
        ]
      );
    } else {
      this.inMemoryData.apiDefinitions.push(newApi);
    }

    return newApi;
  }

  public async getApiDefinition(id: string): Promise<ApiDefinition | null> {
    if (this.isConnected) {
      const result = await this.db?.query<ApiDefinition>(
        'SELECT * FROM api_definitions WHERE id = $1',
        [id]
      );
      return result?.[0] || null;
    } else {
      return this.inMemoryData.apiDefinitions.find(api => api.id === id) || null;
    }
  }

  public async updateApiDefinition(id: string, updates: Partial<ApiDefinition>): Promise<ApiDefinition | null> {
    const now = new Date().toISOString();
    
    if (this.isConnected) {
      const existing = await this.getApiDefinition(id);
      if (!existing) return null;

      const updated: ApiDefinition = {
        ...existing,
        ...updates,
        updatedAt: now,
      };

      await this.db?.query(
        `UPDATE api_definitions 
         SET name = $1, description = $2, version = $3, updated_at = $4, config = $5, status = $6, gateway_type = $7
         WHERE id = $8`,
        [
          updated.name,
          updated.description,
          updated.version,
          updated.updatedAt,
          JSON.stringify(updated.config),
          updated.status,
          updated.gatewayType,
          id,
        ]
      );

      return updated;
    } else {
      const index = this.inMemoryData.apiDefinitions.findIndex(api => api.id === id);
      if (index === -1) return null;

      const updated = {
        ...this.inMemoryData.apiDefinitions[index],
        ...updates,
        updatedAt: now,
      };
      this.inMemoryData.apiDefinitions[index] = updated;
      return updated;
    }
  }

  public async deleteApiDefinition(id: string): Promise<boolean> {
    if (this.isConnected) {
      const result = await this.db?.query(
        'DELETE FROM api_definitions WHERE id = $1',
        [id]
      );
      return result?.length > 0;
    } else {
      const initialLength = this.inMemoryData.apiDefinitions.length;
      this.inMemoryData.apiDefinitions = this.inMemoryData.apiDefinitions.filter(api => api.id !== id);
      return this.inMemoryData.apiDefinitions.length < initialLength;
    }
  }

  // API Key Operations
  public async createApiKey(key: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newKey: ApiKey = {
      ...key,
      id,
      createdAt: now,
    };

    if (this.isConnected) {
      await this.db?.query(
        `INSERT INTO api_keys (id, api_id, key, name, description, created_at, expires_at, status, permissions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newKey.id,
          newKey.apiId,
          newKey.key,
          newKey.name,
          newKey.description,
          newKey.createdAt,
          newKey.expiresAt,
          newKey.status,
          JSON.stringify(newKey.permissions),
        ]
      );
    } else {
      this.inMemoryData.apiKeys.push(newKey);
    }

    return newKey;
  }

  public async getApiKey(id: string): Promise<ApiKey | null> {
    if (this.isConnected) {
      const result = await this.db?.query<ApiKey>(
        'SELECT * FROM api_keys WHERE id = $1',
        [id]
      );
      return result?.[0] || null;
    } else {
      return this.inMemoryData.apiKeys.find(key => key.id === id) || null;
    }
  }

  public async updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | null> {
    if (this.isConnected) {
      const existing = await this.getApiKey(id);
      if (!existing) return null;

      const updated: ApiKey = {
        ...existing,
        ...updates,
      };

      await this.db?.query(
        `UPDATE api_keys 
         SET name = $1, description = $2, expires_at = $3, status = $4, permissions = $5
         WHERE id = $6`,
        [
          updated.name,
          updated.description,
          updated.expiresAt,
          updated.status,
          JSON.stringify(updated.permissions),
          id,
        ]
      );

      return updated;
    } else {
      const index = this.inMemoryData.apiKeys.findIndex(key => key.id === id);
      if (index === -1) return null;

      const updated = {
        ...this.inMemoryData.apiKeys[index],
        ...updates,
      };
      this.inMemoryData.apiKeys[index] = updated;
      return updated;
    }
  }

  public async deleteApiKey(id: string): Promise<boolean> {
    if (this.isConnected) {
      const result = await this.db?.query(
        'DELETE FROM api_keys WHERE id = $1',
        [id]
      );
      return result?.length > 0;
    } else {
      const initialLength = this.inMemoryData.apiKeys.length;
      this.inMemoryData.apiKeys = this.inMemoryData.apiKeys.filter(key => key.id !== id);
      return this.inMemoryData.apiKeys.length < initialLength;
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
} 