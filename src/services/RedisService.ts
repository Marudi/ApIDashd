
import { toast } from "sonner";

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

// Browser-compatible mock implementation of Redis client
export class RedisService {
  private static instance: RedisService;
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
  private mockConnected: boolean = false;

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
      console.log("Attempting to connect to Redis:", this.buildRedisUrl());
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate a successful connection 80% of the time
      const isSuccessful = Math.random() < 0.8;
      
      if (!isSuccessful) {
        throw new Error("Failed to connect to Redis server");
      }
      
      this.mockConnected = true;
      
      this.updateConnectionStatus({
        connected: true,
        lastTestedAt: new Date(),
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Redis connection error:", errorMessage);
      
      this.updateConnectionStatus({
        connected: false,
        lastTestedAt: new Date(),
        error: errorMessage
      });
      
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 200));
    this.mockConnected = false;
    
    this.updateConnectionStatus({
      connected: false
    });
    
    console.log("Disconnected from Redis");
  }

  public async testConnection(): Promise<boolean> {
    try {
      const connected = await this.connect();
      
      if (connected) {
        // Simulate a PING command
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast.success("Redis connection successful", {
          description: "Successfully connected to Redis server"
        });
        
        return true;
      }
      
      toast.error("Redis connection test failed", {
        description: this.connectionStatus.error || "Unknown error"
      });
      
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

  // Mock implementation of getTykApis
  public async getTykApis(): Promise<string[]> {
    if (!this.mockConnected) {
      await this.connect();
    }
    
    if (!this.mockConnected) {
      throw new Error("Redis client not connected");
    }
    
    // Simulate fetching API definitions
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return mock API definitions
    return [
      JSON.stringify({ 
        id: "redis-api-1", 
        name: "Redis API 1", 
        upstream_url: "https://api1.example.com" 
      }),
      JSON.stringify({ 
        id: "redis-api-2", 
        name: "Redis API 2", 
        upstream_url: "https://api2.example.com" 
      })
    ];
  }
}

// Export a singleton instance
export const redisService = RedisService.getInstance();
