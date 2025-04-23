
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
  private connectionAttempts: number = 0;
  private maxRetries: number = 3;
  private reconnectTimer: number | null = null;

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
    try {
      const savedConfig = localStorage.getItem("redis-config");
      if (savedConfig) {
        this.config = JSON.parse(savedConfig);
      }
    } catch (error) {
      console.error("Failed to load Redis config from localStorage:", error);
      // Use default config if loading fails
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem("redis-config", JSON.stringify(this.config));
    } catch (error) {
      console.error("Failed to save Redis config to localStorage:", error);
      toast.error("Failed to save Redis configuration", {
        description: "Your settings may not persist after page reload"
      });
    }
  }

  public getConfig(): RedisConfig {
    return { ...this.config };
  }

  public updateConfig(config: Partial<RedisConfig>): void {
    // Validate required fields
    if (config.host !== undefined && config.host.trim() === "") {
      toast.error("Invalid Redis configuration", {
        description: "Host cannot be empty"
      });
      return;
    }

    if (config.port !== undefined && (config.port <= 0 || config.port > 65535)) {
      toast.error("Invalid Redis configuration", {
        description: "Port must be between 1 and 65535"
      });
      return;
    }

    this.config = {
      ...this.config,
      ...config
    };
    
    this.saveConfig();
    
    // Reset connection status if connection-related config changes
    if (
      config.host !== undefined || 
      config.port !== undefined || 
      config.username !== undefined || 
      config.password !== undefined || 
      config.tls !== undefined
    ) {
      this.updateConnectionStatus({
        connected: false,
        lastTestedAt: null,
        error: null
      });
      
      // Cancel any pending reconnection attempts
      this.cancelReconnectTimer();
    }
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

  private cancelReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect(delay: number = 5000): void {
    this.cancelReconnectTimer();
    this.reconnectTimer = window.setTimeout(() => {
      console.log("Attempting to reconnect to Redis...");
      this.connect().catch(error => {
        console.error("Reconnection attempt failed:", error);
      });
    }, delay);
  }

  public async connect(): Promise<boolean> {
    // Validate config before attempting connection
    if (!this.config.host || this.config.host.trim() === "") {
      const errorMessage = "Redis host is required";
      this.updateConnectionStatus({
        connected: false,
        lastTestedAt: new Date(),
        error: errorMessage
      });
      console.error(errorMessage);
      return false;
    }

    try {
      console.log("Attempting to connect to Redis:", this.buildRedisUrl());
      this.connectionAttempts++;
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For production environment, we'd handle different failure scenarios
      // Here we'll simulate a more realistic behavior with retries
      
      // Simulate a successful connection 80% of the time, but allow for 
      // temporary failures that succeed on retry
      const isSuccessful = Math.random() < 0.8 || this.connectionAttempts > 1;
      
      if (!isSuccessful) {
        throw new Error("Failed to connect to Redis server");
      }
      
      this.mockConnected = true;
      this.connectionAttempts = 0;
      
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
      
      // If we haven't exceeded max retries, schedule a reconnection attempt
      if (this.connectionAttempts < this.maxRetries) {
        this.scheduleReconnect(2000 * this.connectionAttempts); // Exponential backoff
      } else {
        this.connectionAttempts = 0; // Reset for next manual attempt
      }
      
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.cancelReconnectTimer();
    
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 200));
    this.mockConnected = false;
    
    this.updateConnectionStatus({
      connected: false
    });
    
    console.log("Disconnected from Redis");
  }

  public async testConnection(): Promise<boolean> {
    this.cancelReconnectTimer();
    this.connectionAttempts = 0;
    
    try {
      // Validate config before attempting connection
      if (!this.config.host || this.config.host.trim() === "") {
        throw new Error("Redis host is required");
      }
      
      if (this.config.port <= 0 || this.config.port > 65535) {
        throw new Error("Port must be between 1 and 65535");
      }
      
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

  // Mock implementation of getTykApis with improved error handling
  public async getTykApis(): Promise<string[]> {
    try {
      if (!this.mockConnected) {
        await this.connect();
      }
      
      if (!this.mockConnected) {
        throw new Error("Redis client not connected");
      }
      
      // Simulate fetching API definitions
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // In production, this would fetch actual data from Redis
      // Return mock API definitions for simulation
      return [
        JSON.stringify({ 
          id: "redis-api-1", 
          name: "Redis API 1", 
          upstream_url: "https://api1.example.com",
          active: true
        }),
        JSON.stringify({ 
          id: "redis-api-2", 
          name: "Redis API 2", 
          upstream_url: "https://api2.example.com",
          active: true
        }),
        JSON.stringify({ 
          id: "redis-api-3", 
          name: "Redis API 3", 
          upstream_url: "https://api3.example.com",
          active: false
        })
      ];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Redis error';
      console.error("Error fetching Tyk APIs from Redis:", errorMessage);
      throw new Error(`Redis error: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const redisService = RedisService.getInstance();
