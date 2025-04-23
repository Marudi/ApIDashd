
import { useEffect, useState } from 'react';
import { ApiFlow } from '@/lib/api-builder-types';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ApiFlowJsonEditorProps {
  flow: ApiFlow;
  updateFlow: (flow: ApiFlow) => void;
}

export function ApiFlowJsonEditor({ flow, updateFlow }: ApiFlowJsonEditorProps) {
  const [jsonValue, setJsonValue] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleApplyJson = () => {
    try {
      const parsedFlow = JSON.parse(jsonValue) as ApiFlow;
      
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

  return (
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
      <div>
        <Button 
          onClick={handleApplyJson} 
          className="w-full"
          disabled={!isValidJson}
        >
          <Upload className="mr-2 h-4 w-4" />
          Apply JSON
        </Button>
      </div>
    </div>
  );
}
