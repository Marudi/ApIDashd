
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as yaml from "js-yaml";
import { ApiDefinition } from "@/lib/types";

interface ApiExportImportProps {
  apis: ApiDefinition[];
  onImport: (importedApis: ApiDefinition[]) => void;
}

export default function ApiExportImport({ apis, onImport }: ApiExportImportProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Export APIs as JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(apis, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "apis-export.json");
  };

  // Export APIs as YAML
  const handleExportYaml = () => {
    const yamlStr = yaml.dump(apis);
    const blob = new Blob([yamlStr], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "apis-export.yaml");
  };

  // Trigger download
  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: `API definitions exported as ${filename}`,
    });
  };

  // Import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let imported: ApiDefinition[];
        if (file.name.endsWith(".json")) {
          imported = JSON.parse(content);
        } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
          imported = yaml.load(content) as ApiDefinition[];
        } else {
          throw new Error("Unknown file type");
        }
        if (!Array.isArray(imported)) throw new Error("Invalid file format.");
        onImport(imported);
        toast({ title: "Import Successful", description: "API definitions imported." });
      } catch (err: any) {
        toast({
          title: "Import Failed",
          description: err.message || "Could not parse file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be uploaded multiple times
    e.target.value = "";
  };

  return (
    <Card className="p-4 mb-4 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExportJson}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button variant="outline" onClick={handleExportYaml}>
          <Download className="h-4 w-4 mr-2" />
          Export YAML
        </Button>
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>
    </Card>
  );
}
