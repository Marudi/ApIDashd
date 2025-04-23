import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ApiFlowJsonEditorProps, JsonValidationResult } from './types';
import { useDebounce } from '@/hooks/useDebounce';

export function ApiFlowJsonEditor({ flow, updateFlow }: ApiFlowJsonEditorProps) {
  const [jsonValue, setJsonValue] = useState<string>('');
  const [validation, setValidation] = useState<JsonValidationResult>({ isValid: true });
  const debouncedJsonValue = useDebounce(jsonValue, 500);

  useEffect(() => {
    try {
      const jsonString = JSON.stringify(flow, null, 2);
      // Only update if the new value is different to avoid infinite loops
      if (jsonString !== jsonValue) {
        setJsonValue(jsonString);
        setValidation({ isValid: true });
      }
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

  useEffect(() => {
    const validationResult = validateJson(debouncedJsonValue);
    setValidation(validationResult);

    if (validationResult.isValid) {
      try {
        const parsedFlow = JSON.parse(debouncedJsonValue);
        if (JSON.stringify(parsedFlow) !== JSON.stringify(flow)) {
          updateFlow(parsedFlow);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [debouncedJsonValue, updateFlow]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonValue(e.target.value);
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
          onClick={() => updateFlow(JSON.parse(jsonValue))} 
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
