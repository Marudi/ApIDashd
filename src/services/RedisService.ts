
import { toast } from "sonner";
import { createClient, RedisClientType } from "redis";

export interface RedisConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: number;
  tls: boolean;
  connectionName: string;
}

export interface RedisConnectionStatus {
  connected: boolean;
  lastTestedAt: Date | null;
  error: string | null;
}

export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;
  private config: RedisConfig = {
    host: "",
    port: 6379,
    username: "",
    password: "",
    database: 0,
    tls: false,
    connectionName: "tyk-gateway-redis"
  };
  private connectionStatus: RedisConnectionStatus = {
    connected: false,
    lastTestedAt: null,
    error: null
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private loadConfig(): void {
    const savedConfig = localStorage.getItem("redis-config");
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  private saveConfig(): void {
    localStorage.setItem("redis-config", JSON.stringify(this.config));
  }

  public getConfig(): RedisConfig {
    return { ...this.config };
  }

  public updateConfig(config: Partial<RedisConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    this.saveConfig();
  }

  public getConnectionStatus(): RedisConnectionStatus {
    return { ...this.connectionStatus };
  }

  private updateConnectionStatus(status: Partial<RedisConnectionStatus>): void {
    this.connectionStatus = {
      ...this.connectionStatus,
      ...status
    };
  }

  public async connect(): Promise<boolean> {
    try {
      if (this.client) {
        await this.disconnect();
      }

      const url = this.buildRedisUrl();
      
      this.client = createClient({
        url,
        name: this.config.connectionName
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error', err);
        this.updateConnectionStatus({
          connected: false,
          error: err.message
        });
        toast.error("Redis connection error", {
          description: err.message
        });
      });

      await this.client.connect();
      
      this.updateConnectionStatus({
        connected: true,
        lastTestedAt: new Date(),
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.updateConnectionStatus({
        connected: false,
        lastTestedAt: new Date(),
        error: errorMessage
      });
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.disconnect();
        this.client = null;
        this.updateConnectionStatus({
          connected: false
        });
      } catch (error) {
        console.error('Redis disconnect error', error);
      }
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const connected = await this.connect();
      if (connected) {
        // Try a simple PING to verify connection is working
        const pingResult = await this.client!.ping();
        const success = pingResult === 'PONG';
        
        if (success) {
          toast.success("Redis connection successful", {
            description: "Successfully connected to Redis server"
          });
        } else {
          toast.error("Redis connection test failed", {
            description: "Connected but PING command failed"
          });
        }
        
        return success;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Redis connection test failed", {
        description: errorMessage
      });
      
      this.updateConnectionStatus({
        connected: false,
        lastTestedAt: new Date(),
        error: errorMessage
      });
      
      return false;
    }
  }

  private buildRedisUrl(): string {
    const protocol = this.config.tls ? 'rediss' : 'redis';
    const auth = this.config.username 
      ? `${encodeURIComponent(this.config.username)}:${encodeURIComponent(this.config.password)}@`
      : this.config.password 
        ? `:${encodeURIComponent(this.config.password)}@` 
        : '';
    
    return `${protocol}://${auth}${this.config.host}:${this.config.port}/${this.config.database}`;
  }

  // Tyk specific Redis operations can be added here
  public async getTykApis(): Promise<string[]> {
    if (!this.client || !this.connectionStatus.connected) {
      await this.connect();
    }
    
    if (!this.client) {
      throw new Error("Redis client not connected");
    }
    
    try {
      // Example: getting Tyk API definitions from Redis
      // This is a simplified example - actual implementation depends on Tyk's Redis schema
      const keys = await this.client.keys('tyk:apis:*');
      const apiDefs: string[] = [];
      
      for (const key of keys) {
        const value = await this.client.get(key);
        if (value) {
          apiDefs.push(value);
        }
      }
      
      return apiDefs;
    } catch (error) {
      console.error('Error fetching Tyk APIs from Redis', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const redisService = RedisService.getInstance();
