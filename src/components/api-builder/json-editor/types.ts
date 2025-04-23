
import { ApiFlow } from '@/lib/api-builder-types';

export interface ApiFlowJsonEditorProps {
  flow: ApiFlow;
  updateFlow: (flow: ApiFlow) => void;
}

export type JsonValidationResult = {
  isValid: boolean;
  error?: string;
};

export interface ImportResult {
  success: boolean;
  flow?: ApiFlow;
  error?: string;
}

export interface ExportResult {
  success: boolean;
  error?: string;
}
