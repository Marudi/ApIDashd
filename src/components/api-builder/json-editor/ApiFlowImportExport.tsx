
import { Button } from '@/components/ui/button';
import { Upload, Download, FileJson } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ApiFlowJsonEditorProps, ImportResult, ExportResult } from './types';
import { convertFlowToApiDefinition } from '@/lib/api-builder/flow-utils';

export function ApiFlowImportExport({ flow, exportableFlow, updateFlow }: ApiFlowJsonEditorProps) {
  const importFlow = (file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedFlow = JSON.parse(content);
          
          if (!parsedFlow.id || !parsedFlow.nodes || !parsedFlow.edges) {
            resolve({ 
              success: false, 
              error: 'Uploaded file does not contain valid API flow data' 
            });
            return;
          }
          
          resolve({ success: true, flow: parsedFlow });
        } catch (error) {
          resolve({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Invalid flow definition' 
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const exportFlow = (format: 'internal' | 'api'): ExportResult => {
    try {
      const data = format === 'internal' ? flow : exportableFlow;
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = format === 'internal' 
        ? `api-flow-${flow.id}.json` 
        : `api-definition-${flow.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export flow' 
      };
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importFlow(file);
    
    if (result.success && result.flow) {
      updateFlow(result.flow);
      toast({
        title: "Flow Imported",
        description: "The API flow has been imported successfully",
      });
    } else {
      toast({
        title: "Import Error",
        description: result.error,
        variant: "destructive"
      });
    }
    
    event.target.value = '';
  };

  const handleExportFlow = (format: 'internal' | 'api') => {
    const result = exportFlow(format);
    
    if (result.success) {
      toast({
        title: "Flow Exported",
        description: `Your API flow has been exported as ${format === 'internal' ? 'internal' : 'API'} format`,
      });
    } else {
      toast({
        title: "Export Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => document.getElementById('flow-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Flow
        </Button>
        <input
          id="flow-upload"
          type="file"
          accept=".json"
          className="sr-only"
          onChange={handleFileUpload}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => handleExportFlow('internal')}
      >
        <Download className="mr-2 h-4 w-4" />
        Export Flow
      </Button>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => handleExportFlow('api')}
      >
        <FileJson className="mr-2 h-4 w-4" />
        Export API Format
      </Button>
    </div>
  );
}
