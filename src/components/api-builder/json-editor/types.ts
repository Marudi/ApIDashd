
import { ApiDefinition } from "@/lib/types";
import { ApiFlow } from '@/lib/api-builder-types';

export interface ApiFlowJsonEditorProps {
  flow: ApiFlow;
  exportableFlow: ApiDefinition;
  updateFlow: (flow: ApiFlow) => void;
}

export interface ImportResult {
  success: boolean;
  flow?: ApiFlow;
  error?: string;
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

export type ExportFormat = 'internal' | 'api';

