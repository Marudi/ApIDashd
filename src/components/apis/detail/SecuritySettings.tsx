
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ApiDefinition } from "@/lib/types";
import { AuthenticationSection } from "./security/AuthenticationSection";
import { RequestControlsSection } from "./security/RequestControlsSection";
import { AdvancedSecuritySection } from "./security/AdvancedSecuritySection";

interface SecuritySettingsProps {
  api: ApiDefinition;
  onConfigureRateLimiting: () => void;
  onConfigureQuota: () => void;
}

const SecuritySettings = ({
  api,
  onConfigureRateLimiting,
  onConfigureQuota
}: SecuritySettingsProps) => {
  const getCorsSettings = () => {
    // This would typically come from the API object in production
    return {
      enabled: true,
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400
    };
  };

  const getSecurityHeaders = () => {
    // This would typically come from the API object in production
    return {
      enabled: true,
      xFrameOptions: "DENY",
      contentSecurityPolicy: "default-src 'self'",
      xContentTypeOptions: "nosniff",
      strictTransportSecurity: "max-age=31536000; includeSubDomains"
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Configure authentication, rate limiting, and other security features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AuthenticationSection api={api} />
        
        <Separator />
        
        <RequestControlsSection
          api={api}
          onConfigureRateLimiting={onConfigureRateLimiting}
          onConfigureQuota={onConfigureQuota}
        />
        
        <Separator />
        
        <AdvancedSecuritySection
          getCorsSettings={getCorsSettings}
          getSecurityHeaders={getSecurityHeaders}
        />
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
