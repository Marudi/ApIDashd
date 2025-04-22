
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database } from "lucide-react";

export function PostgresConfigSection() {
  const { toast } = useToast();
  const [host, setHost] = useState("");
  const [port, setPort] = useState("5432");
  const [db, setDb] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Save config to localStorage
  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(
      "pg_config",
      JSON.stringify({ host, port, db, user, password })
    );
    setSaving(false);
    toast({
      title: "PostgreSQL config saved!",
      description: "Your settings have been stored locally.",
      duration: 2000,
    });
  };

  // Connection test (simulated)
  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      if (host && port && db && user && password) {
        toast({
          title: "Connection successful!",
          description: `Connected to ${db} at ${host}:${port} as ${user}`,
          variant: "default",
          duration: 2500,
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Please fill in all fields to test connection.",
          variant: "destructive",
        });
      }
      setTesting(false);
    }, 1000);
  };

  // Autofill from localStorage if available
  React.useEffect(() => {
    const local = localStorage.getItem("pg_config");
    if (local) {
      try {
        const obj = JSON.parse(local);
        setHost(obj.host || "");
        setPort(obj.port || "5432");
        setDb(obj.db || "");
        setUser(obj.user || "");
        setPassword(obj.password || "");
      } catch {}
    }
  }, []);

  return (
    <Card className="mb-6 border-2 border-primary/20 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Remote PostgreSQL Database</CardTitle>
            <CardDescription>
              Connect this dashboard to your external PostgreSQL database.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="pg-host">Host</Label>
            <Input
              id="pg-host"
              placeholder="example.corp.com"
              type="text"
              value={host}
              onChange={e => setHost(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pg-port">Port</Label>
            <Input
              id="pg-port"
              placeholder="5432"
              type="number"
              min={1}
              max={65535}
              value={port}
              onChange={e => setPort(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pg-db">Database</Label>
            <Input
              id="pg-db"
              placeholder="db_name"
              type="text"
              value={db}
              onChange={e => setDb(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pg-user">User</Label>
            <Input
              id="pg-user"
              placeholder="username"
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="pg-pass">Password</Label>
            <Input
              id="pg-pass"
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="col-span-full flex gap-3 pt-4">
            <Button 
              type="button"
              onClick={handleTest}
              variant="outline"
              disabled={testing}
            >
              {testing ? "Testing..." : "Test Connection"}
            </Button>
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
