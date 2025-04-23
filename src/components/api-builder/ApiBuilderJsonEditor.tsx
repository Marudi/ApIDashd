
import { useState, useEffect } from 'react';
import { ApiFlow } from '@/lib/api-builder-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Upload, FileJson, FileUpload, FileDownload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ApiBuilderJsonEditorProps {
  flow: ApiFlow;
  updateFlow: (flow: ApiFlow) => void;
}

export function ApiBuilderJsonEditor({ flow, updateFlow }: ApiBuilderJsonEditorProps) {
  const [jsonValue, setJsonValue] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Update the JSON value when the flow changes
  useEffect(() => {
    try {
      const jsonString = JSON.stringify(flow, null, 2);
      setJsonValue(jsonString);
      setIsValidJson(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error converting flow to JSON:', error);
      setIsValidJson(false);
      setErrorMessage('Error generating JSON from the current flow');
    }
  }, [flow]);

  // Handle JSON text changes
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonValue(newValue);
    
    try {
      JSON.parse(newValue);
      setIsValidJson(true);
      setErrorMessage('');
    } catch (error) {
      setIsValidJson(false);
      setErrorMessage('Invalid JSON format');
    }
  };

  // Apply JSON changes to the flow
  const handleApplyJson = () => {
    try {
      const parsedFlow = JSON.parse(jsonValue) as ApiFlow;
      
      // Basic validation to ensure the parsed object has required ApiFlow properties
      if (!parsedFlow.id || !parsedFlow.nodes || !parsedFlow.edges) {
        throw new Error('JSON does not contain valid API flow data');
      }
      
      updateFlow(parsedFlow);
      toast({
        title: "Flow Updated",
        description: "The API flow has been updated from JSON",
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setIsValidJson(false);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON structure');
      
      toast({
        title: "Error Updating Flow",
        description: error instanceof Error ? error.message : 'Invalid JSON structure',
        variant: "destructive"
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedFlow = JSON.parse(content) as ApiFlow;
        
        // Validate the flow structure
        if (!parsedFlow.id || !parsedFlow.nodes || !parsedFlow.edges) {
          throw new Error('Uploaded file does not contain valid API flow data');
        }
        
        setJsonValue(JSON.stringify(parsedFlow, null, 2));
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
    
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = '';
  };

  // Handle JSON download
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
    <Accordion type="single" collapsible className="w-full mt-4">
      <AccordionItem value="json-editor">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            <span>JSON Editor & Import/Export</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>API Flow JSON Editor</CardTitle>
              <CardDescription>
                Edit API flow directly in JSON format or import/export flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Textarea 
                    value={jsonValue}
                    onChange={handleJsonChange}
                    className={`font-mono h-96 ${!isValidJson ? 'border-red-500' : ''}`}
                  />
                  {!isValidJson && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleApplyJson} 
                    className="w-full"
                    disabled={!isValidJson}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Apply JSON
                  </Button>
                  
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => document.getElementById('flow-upload')?.click()}
                    >
                      <FileUpload className="mr-2 h-4 w-4" />
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
                    <FileDownload className="mr-2 h-4 w-4" />
                    Export Flow
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
