
import { useState, useEffect } from "react";
import { Plus, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { mockApiKeys } from "@/lib/mock-data";
import { ApiKey } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApiKeySearch } from "@/components/api-keys/ApiKeySearch";
import { NewKeyDialog } from "@/components/api-keys/NewKeyDialog";
import { ApiKeysTable } from "@/components/api-keys/ApiKeysTable";
import { getPolicyName } from "@/lib/api-key-utils";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";
import { useDemoData } from "@/contexts/DemoDataContext";
import { Card } from "@/components/ui/card";

const ApiKeys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const { toast } = useToast();
  const { persistentEnabled, getApiKeys, setApiKeys } = usePersistentStorage();
  const { showDemoData } = useDemoData();

  // Load keys from persistent local storage (if enabled)
  useEffect(() => {
    if (persistentEnabled) {
      const stored = getApiKeys();
      if (stored && Array.isArray(stored)) {
        setKeys(stored);
      }
    }
  }, [persistentEnabled, getApiKeys]);

  // Update persistent storage WHEN keys change and persistence is enabled
  useEffect(() => {
    if (persistentEnabled) setApiKeys(keys);
  }, [keys, persistentEnabled, setApiKeys]);

  // Filter API keys based on search term
  const filteredKeys = keys.filter(key => 
    key.policyId ? getPolicyName(key.policyId).toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const generateNewKey = () => {
    if (!selectedPolicy) {
      toast({
        title: "Error",
        description: "Please select a policy for the new key",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: uuidv4(),
      keyHash: uuidv4().replace(/-/g, ""),
      policyId: selectedPolicy,
      status: "active" as const,
      createdAt: new Date().toISOString(),
      expires: undefined,
      lastUsed: undefined
    };

    setKeys([newKey, ...keys]);
    setShowNewKeyDialog(false);
    setSelectedPolicy(null);
    
    toast({
      title: "Success",
      description: "New API key has been generated",
    });
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: "revoked" as const } : k));
    toast({
      title: "Key Revoked",
      description: "The API key has been revoked successfully"
    });
  };

  // Handler for toggle
  const handleToggleActive = async (id: string, active: boolean) => {
    setKeys(keys =>
      keys.map(key =>
        key.id === id && key.status !== "revoked"
          ? { ...key, status: active ? "active" : "inactive" }
          : key
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <ApiKeySearch value={searchTerm} onChange={setSearchTerm} />
        <Button onClick={() => setShowNewKeyDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>
      {!showDemoData ? (
        <Card className="my-10 py-16 flex flex-col items-center gap-4 text-muted-foreground">
          <Key className="w-10 h-10" />
          <div className="text-lg font-semibold">Demo Data Disabled</div>
          <div className="max-w-md mx-auto text-center">
            Demo/sample API keys are currently disabled in your dashboard settings. To see example API keys, enable <b>"Show demo data in dashboard"</b> in the <span className="font-medium">Settings</span> page.
          </div>
        </Card>
      ) : (
      <>
        <ApiKeysTable
          keys={filteredKeys}
          onRevoke={handleRevokeKey}
          onToggleActive={handleToggleActive}
        />

        <NewKeyDialog
          open={showNewKeyDialog}
          onOpenChange={setShowNewKeyDialog}
          selectedPolicy={selectedPolicy}
          onPolicySelect={setSelectedPolicy}
          onGenerate={generateNewKey}
        />
      </>
      )}
    </DashboardLayout>
  );
};

export default ApiKeys;
