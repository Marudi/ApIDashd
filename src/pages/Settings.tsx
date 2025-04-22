
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Clock, Database, Globe, Lock, MailCheck, RefreshCw, Save, Server, Shield, User, Webhook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GatewaySync } from "@/components/settings/GatewaySync";
import { Settings as SettingsIcon } from "lucide-react";
import { PostgresConfigSection } from "@/components/settings/PostgresConfigSection";
import { GeneralSettingsSection } from "@/components/settings/GeneralSettingsSection";
import { SecuritySettingsSection } from "@/components/settings/SecuritySettingsSection";
import { GatewaySettingsSection } from "@/components/settings/GatewaySettingsSection";
import { NotificationsSettingsSection } from "@/components/settings/NotificationsSettingsSection";
import { WebhookSettingsSection } from "@/components/settings/WebhookSettingsSection";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className={`${isMobile ? "flex-wrap" : ""}`}>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="gateway">Gateway</TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Live Sync
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center">
              <Webhook className="mr-2 h-4 w-4" />
              Webhooks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <GeneralSettingsSection />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecuritySettingsSection />
          </TabsContent>
          
          <TabsContent value="gateway" className="mt-6">
            <GatewaySettingsSection />
          </TabsContent>
          
          <TabsContent value="sync" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GatewaySync type="tyk" />
              <GatewaySync type="kong" />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <NotificationsSettingsSection />
          </TabsContent>
          
          <TabsContent value="webhooks" className="mt-6">
            <WebhookSettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
