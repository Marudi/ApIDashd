
import { memo, useMemo } from 'react';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';
import { NodeTypes } from 'reactflow';
import { ApiNodeType } from '@/lib/api-builder-types';

// Helper to create memoized node component
const createMemoizedNode = (nodeType: ApiNodeType, onNodeDuplicate?: (nodeId: string) => void, onNodeDelete?: (nodeId: string) => void) => {
  return memo((props: any) => (
    <ApiBuilderNode {...props} onDuplicate={onNodeDuplicate} onDelete={onNodeDelete} />
  ));
};

export const createCustomNodeTypes = (onNodeDuplicate?: (nodeId: string) => void, onNodeDelete?: (nodeId: string) => void): NodeTypes => {
  return useMemo(() => ({
    input: createMemoizedNode('input', onNodeDuplicate, onNodeDelete),
    endpoint: createMemoizedNode('endpoint', onNodeDuplicate, onNodeDelete),
    transform: createMemoizedNode('transform', onNodeDuplicate, onNodeDelete),
    auth: createMemoizedNode('auth', onNodeDuplicate, onNodeDelete),
    ratelimit: createMemoizedNode('ratelimit', onNodeDuplicate, onNodeDelete),
    cache: createMemoizedNode('cache', onNodeDuplicate, onNodeDelete),
    mock: createMemoizedNode('mock', onNodeDuplicate, onNodeDelete),
    validator: createMemoizedNode('validator', onNodeDuplicate, onNodeDelete),
    output: createMemoizedNode('output', onNodeDuplicate, onNodeDelete),
    default: createMemoizedNode('input', onNodeDuplicate, onNodeDelete),
  }), [onNodeDuplicate, onNodeDelete]);
};
