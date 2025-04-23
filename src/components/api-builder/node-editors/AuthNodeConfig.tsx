
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiNodeData } from "@/lib/api-builder-types";

const authNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  authType: z.enum(["none", "basic", "jwt", "apikey", "oauth", "token", "oauth2"]),
  authConfig: z.object({
    apiKeyName: z.string().optional(),
    apiKeyLocation: z.enum(["header", "query"]).optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    jwtSecret: z.string().optional(),
  }).optional(),
});

interface AuthNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function AuthNodeConfig({ data, onSave, onCancel }: AuthNodeConfigProps) {
  const form = useForm({
    resolver: zodResolver(authNodeSchema),
    defaultValues: {
      label: data.label || "",
      authType: data.authType || "none",
      authConfig: data.authConfig || {},
    },
  });

  const watchAuthType = form.watch("authType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="jwt">JWT</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {watchAuthType === "apikey" && (
          <>
            <FormField
              control={form.control}
              name="authConfig.apiKeyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="X-API-Key" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authConfig.apiKeyLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="query">Query Parameter</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </>
        )}

        {watchAuthType === "basic" && (
          <>
            <FormField
              control={form.control}
              name="authConfig.username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authConfig.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {watchAuthType === "jwt" && (
          <FormField
            control={form.control}
            name="authConfig.jwtSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JWT Secret</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
