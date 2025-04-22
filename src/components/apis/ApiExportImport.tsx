
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as yaml from "js-yaml";
import { ApiDefinition } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileJson, File, FileUp } from "lucide-react";
import { apiDefsToXml, xmlToApiDefs } from "@/lib/xmlUtils";

interface ApiExportImportProps {
  apis: ApiDefinition[];
  onImport: (importedApis: ApiDefinition[]) => void;
}

export default function ApiExportImport({ apis, onImport }: ApiExportImportProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useIsMobile();

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

  // Export APIs as XML
  const handleExportXml = () => {
    const xmlStr = apiDefsToXml(apis);
    const blob = new Blob([xmlStr], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "apis-export.xml");
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
        } else if (file.name.endsWith(".xml")) {
          imported = xmlToApiDefs(content);
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
    <Card className={`p-4 mb-4 ${isMobile ? "flex flex-col gap-2" : "flex flex-row gap-4 items-center"}`}>
      <div className={`flex ${isMobile ? "flex-col w-full" : "gap-2"}`}>
        <Button 
          variant="outline" 
          onClick={handleExportJson}
          className={isMobile ? "mb-2 w-full" : ""}
        >
          <FileJson className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportYaml}
          className={isMobile ? "mb-2 w-full" : ""}
        >
          <Download className="h-4 w-4 mr-2" />
          Export YAML
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportXml}
          className={isMobile ? "mb-2 w-full" : ""}
        >
          <File className="h-4 w-4 mr-2" />
          Export XML
        </Button>
      </div>
      <div className={isMobile ? "w-full" : ""}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.yaml,.yml,.xml"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className={isMobile ? "w-full" : ""}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>
    </Card>
  );
}
