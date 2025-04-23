
import { ApiFlow } from '@/lib/api-builder-types';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiFlowImportExportProps {
  flow: ApiFlow;
  updateFlow: (flow: ApiFlow) => void;
}

export function ApiFlowImportExport({ flow, updateFlow }: ApiFlowImportExportProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedFlow = JSON.parse(content) as ApiFlow;
        
        if (!parsedFlow.id || !parsedFlow.nodes || !parsedFlow.edges) {
          throw new Error('Uploaded file does not contain valid API flow data');
        }
        
        updateFlow(parsedFlow);
        
        toast({
          title: "Flow Imported",
          description: "The API flow has been imported successfully",
        });
      } catch (error) {
        console.error('Error parsing uploaded file:', error);
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : 'Invalid flow definition in uploaded file',
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDownloadJson = () => {
    try {
      const jsonString = JSON.stringify(flow, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `api-flow-${flow.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Flow Exported",
        description: "Your API flow has been exported as JSON",
      });
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast({
        title: "Export Error",
        description: "Failed to export API flow",
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
        onClick={handleDownloadJson}
      >
        <Download className="mr-2 h-4 w-4" />
        Export Flow
      </Button>
    </div>
  );
}
