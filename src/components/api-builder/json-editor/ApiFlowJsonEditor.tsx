
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ApiFlowJsonEditorProps, JsonValidationResult } from './types';

export function ApiFlowJsonEditor({ flow, updateFlow }: ApiFlowJsonEditorProps) {
  const [jsonValue, setJsonValue] = useState<string>('');
  const [validation, setValidation] = useState<JsonValidationResult>({ isValid: true });

  useEffect(() => {
    try {
      const jsonString = JSON.stringify(flow, null, 2);
      setJsonValue(jsonString);
      setValidation({ isValid: true });
    } catch (error) {
      console.error('Error converting flow to JSON:', error);
      setValidation({ 
        isValid: false, 
        error: 'Error generating JSON from the current flow' 
      });
    }
  }, [flow]);

  const validateJson = (json: string): JsonValidationResult => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.id || !parsed.nodes || !parsed.edges) {
        return { 
          isValid: false, 
          error: 'JSON does not contain valid API flow data' 
        };
      }
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      };
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonValue(newValue);
    setValidation(validateJson(newValue));
  };

  const handleApplyJson = () => {
    const validationResult = validateJson(jsonValue);
    if (!validationResult.isValid) {
      setValidation(validationResult);
      toast({
        title: "Error Updating Flow",
        description: validationResult.error,
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedFlow = JSON.parse(jsonValue);
      updateFlow(parsedFlow);
      toast({
        title: "Flow Updated",
        description: "The API flow has been updated from JSON",
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast({
        title: "Error Updating Flow",
        description: "Failed to update the flow",
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
          className={`font-mono h-96 ${!validation.isValid ? 'border-red-500' : ''}`}
        />
        {!validation.isValid && validation.error && (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{validation.error}</AlertDescription>
          </Alert>
        )}
      </div>
      <div>
        <Button 
          onClick={handleApplyJson} 
          className="w-full"
          disabled={!validation.isValid}
        >
          <Upload className="mr-2 h-4 w-4" />
          Apply JSON
        </Button>
      </div>
    </div>
  );
}
