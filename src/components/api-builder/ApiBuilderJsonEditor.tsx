
import { ApiFlow } from '@/lib/api-builder-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileJson } from 'lucide-react';
import { ApiFlowJsonEditor } from './json-editor/ApiFlowJsonEditor';
import { ApiFlowImportExport } from './json-editor/ApiFlowImportExport';
import { useCallback } from 'react';
import { convertFlowToApiDefinition } from '@/lib/api-builder/flow-utils';

interface ApiBuilderJsonEditorProps {
  flow: ApiFlow;
  updateFlow: (flow: ApiFlow) => void;
}

export function ApiBuilderJsonEditor({ flow, updateFlow }: ApiBuilderJsonEditorProps) {
  const handleFlowUpdate = useCallback((updatedFlow: ApiFlow) => {
    updateFlow(updatedFlow);
  }, [updateFlow]);

  const exportableFlow = convertFlowToApiDefinition(flow);

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
                  <ApiFlowJsonEditor 
                    flow={flow} 
                    exportableFlow={exportableFlow}
                    updateFlow={handleFlowUpdate} 
                  />
                </div>
                <div>
                  <ApiFlowImportExport 
                    flow={flow} 
                    exportableFlow={exportableFlow}
                    updateFlow={handleFlowUpdate} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
