
import { useToast } from "@/hooks/use-toast";

export type NotificationType = 'error' | 'api_change' | 'rate_limit' | 'quota' | 'system';
export type NotificationDestination = 'slack' | 'webhook';

export interface NotificationConfig {
  enabled: boolean;
  url: string;
  channel?: string; // For Slack
  contentType?: string; // For custom webhooks
}

export interface NotificationOptions {
  title: string;
  message: string;
  type: NotificationType;
  timestamp?: Date;
  data?: Record<string, any>;
}

class NotificationService {
  private configs: Record<NotificationDestination, NotificationConfig> = {
    slack: {
      enabled: false,
      url: '',
      channel: '#api-alerts'
    },
    webhook: {
      enabled: false,
      url: '',
      contentType: 'application/json'
    }
  };

  private enabledNotificationTypes: NotificationType[] = ['error'];

  // Configure notification destinations
  public configure(destination: NotificationDestination, config: Partial<NotificationConfig>): void {
    this.configs[destination] = {
      ...this.configs[destination],
      ...config
    };
  }

  // Set notification types to receive
  public setEnabledTypes(types: NotificationType[]): void {
    this.enabledNotificationTypes = types;
  }

  // Add a notification type to receive
  public enableType(type: NotificationType): void {
    if (!this.enabledNotificationTypes.includes(type)) {
      this.enabledNotificationTypes.push(type);
    }
  }

  // Remove a notification type
  public disableType(type: NotificationType): void {
    this.enabledNotificationTypes = this.enabledNotificationTypes.filter(t => t !== type);
  }

  // Send notification to all configured destinations
  public async notify(options: NotificationOptions): Promise<boolean> {
    // Check if this notification type is enabled
    if (!this.enabledNotificationTypes.includes(options.type)) {
      console.log(`Notification type ${options.type} is not enabled, skipping`);
      return false;
    }

    const timestamp = options.timestamp || new Date();
    let success = true;

    // Send to Slack if enabled
    if (this.configs.slack.enabled && this.configs.slack.url) {
      try {
        await this.sendToSlack({
          ...options,
          timestamp
        });
      } catch (error) {
        console.error('Failed to send notification to Slack:', error);
        success = false;
      }
    }

    // Send to custom webhook if enabled
    if (this.configs.webhook.enabled && this.configs.webhook.url) {
      try {
        await this.sendToWebhook({
          ...options,
          timestamp
        });
      } catch (error) {
        console.error('Failed to send notification to webhook:', error);
        success = false;
      }
    }

    return success;
  }

  // Test a specific destination
  public async test(destination: NotificationDestination): Promise<boolean> {
    const config = this.configs[destination];
    if (!config.enabled || !config.url) {
      return false;
    }

    const testOptions: NotificationOptions = {
      title: 'Test Notification',
      message: 'This is a test notification from the API Gateway Dashboard',
      type: 'system',
      timestamp: new Date(),
      data: { test: true }
    };

    try {
      if (destination === 'slack') {
        await this.sendToSlack(testOptions);
      } else if (destination === 'webhook') {
        await this.sendToWebhook(testOptions);
      }
      return true;
    } catch (error) {
      console.error(`Failed to send test notification to ${destination}:`, error);
      return false;
    }
  }

  private async sendToSlack(options: NotificationOptions): Promise<Response> {
    const { title, message, type, timestamp, data } = options;
    const { url, channel } = this.configs.slack;

    // Format message for Slack
    const slackPayload = {
      channel,
      text: `*${title}*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: title
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Type:* ${type} | *Time:* ${timestamp?.toISOString()}`
            }
          ]
        }
      ]
    };

    // Add data if available
    if (data) {
      slackPayload.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``
        }
      });
    }

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slackPayload)
    });
  }

  private async sendToWebhook(options: NotificationOptions): Promise<Response> {
    const { url, contentType } = this.configs.webhook;
    const payload = {
      title: options.title,
      message: options.message,
      type: options.type,
      timestamp: options.timestamp?.toISOString(),
      data: options.data
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType || 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();

// Hook for components to use the notification service
export function useNotifications() {
  const { toast } = useToast();

  const notifyWithToast = async (options: NotificationOptions): Promise<boolean> => {
    // Show a toast notification and send to configured webhooks
    toast({
      title: options.title,
      description: options.message,
      variant: options.type === 'error' ? 'destructive' : 'default',
    });
    
    return notificationService.notify(options);
  };

  return {
    notify: notifyWithToast,
    configureSlack: (config: Partial<NotificationConfig>) => 
      notificationService.configure('slack', config),
    configureWebhook: (config: Partial<NotificationConfig>) => 
      notificationService.configure('webhook', config),
    enableType: (type: NotificationType) => 
      notificationService.enableType(type),
    disableType: (type: NotificationType) => 
      notificationService.disableType(type),
    setEnabledTypes: (types: NotificationType[]) => 
      notificationService.setEnabledTypes(types),
    testSlack: () => notificationService.test('slack'),
    testWebhook: () => notificationService.test('webhook')
  };
}
