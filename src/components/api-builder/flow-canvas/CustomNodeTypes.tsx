
import { memo, useCallback } from 'react';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';

export const createCustomNodeTypes = (onNodeDuplicate?: (nodeId: string) => void, onNodeDelete?: (nodeId: string) => void) => ({
  input: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  endpoint: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  transform: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  auth: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  ratelimit: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  cache: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  mock: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  validator: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  output: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
  default: memo((props: any) => <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />),
});
