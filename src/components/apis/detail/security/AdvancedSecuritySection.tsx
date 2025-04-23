
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AdvancedSecuritySectionProps {
  getCorsSettings: () => {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    maxAge: number;
  };
  getSecurityHeaders: () => {
    enabled: boolean;
    xFrameOptions: string;
    contentSecurityPolicy: string;
    xContentTypeOptions: string;
    strictTransportSecurity: string;
  };
}

export function AdvancedSecuritySection({ getCorsSettings, getSecurityHeaders }: AdvancedSecuritySectionProps) {
  const { toast } = useToast();

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Advanced Security</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <p className="font-medium">CORS Settings</p>
            <p className="text-sm text-muted-foreground">
              {getCorsSettings().enabled ? 
                `${getCorsSettings().allowedOrigins.join(", ")}` : 
                "CORS is disabled"
              }
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              toast({
                title: "CORS Settings",
                description: "CORS configuration dialog will be implemented in the next release.",
              });
            }}
          >Configure</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <p className="font-medium">Security Headers</p>
            <p className="text-sm text-muted-foreground">
              {getSecurityHeaders().enabled ? 
                "Standard security headers enabled" : 
                "No security headers configured"
              }
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "Security Headers",
                description: "Security headers configuration dialog will be implemented in the next release.",
              });
            }}
          >Configure</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <p className="font-medium">IP Restrictions</p>
            <p className="text-sm text-muted-foreground">
              No IP restrictions configured
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "IP Restrictions",
                description: "IP restrictions configuration dialog will be implemented in the next release.",
              });
            }}
          >Configure</Button>
        </div>
      </div>
    </div>
  );
}
