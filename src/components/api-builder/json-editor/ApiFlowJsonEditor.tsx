
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload } from 'lucide-react';
import { ApiFlowJsonEditorProps, ExportFormat } from './types';
import { useDebounce } from '@/hooks/useDebounce';

export function ApiFlowJsonEditor({ flow, exportableFlow, updateFlow }: ApiFlowJsonEditorProps) {
  const [format, setFormat] = useState<ExportFormat>('internal');
  const [jsonValue, setJsonValue] = useState<string>(
    JSON.stringify(format === 'internal' ? flow : exportableFlow, null, 2)
  );
  const [validation, setValidation] = useState({ isValid: true, error: '' });
  const debouncedJsonValue = useDebounce(jsonValue, 500);

  const handleFormatChange = (value: ExportFormat) => {
    setFormat(value);
    setJsonValue(JSON.stringify(value === 'internal' ? flow : exportableFlow, null, 2));
  };

  const validateJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (format === 'internal' && (!parsed.id || !parsed.nodes || !parsed.edges)) {
        setValidation({ isValid: false, error: 'Invalid API flow format' });
        return false;
      }
      setValidation({ isValid: true, error: '' });
      return true;
    } catch (error) {
      setValidation({ 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      });
      return false;
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonValue(newValue);
    validateJson(newValue);
  };

  const handleApplyChanges = () => {
    if (validateJson(jsonValue) && format === 'internal') {
      updateFlow(JSON.parse(jsonValue));
    }
  };

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={format} onValueChange={(value: ExportFormat) => handleFormatChange(value)}>
        <ToggleGroupItem value="internal">Internal Format</ToggleGroupItem>
        <ToggleGroupItem value="api">API Format</ToggleGroupItem>
      </ToggleGroup>

      <Textarea 
        value={jsonValue}
        onChange={handleJsonChange}
        className={`font-mono h-96 ${!validation.isValid ? 'border-red-500' : ''}`}
        readOnly={format === 'api'}
      />
      
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validation.error}</AlertDescription>
        </Alert>
      )}

      {format === 'internal' && (
        <Button 
          onClick={handleApplyChanges}
          disabled={!validation.isValid}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Apply Changes
        </Button>
      )}
    </div>
  );
}
