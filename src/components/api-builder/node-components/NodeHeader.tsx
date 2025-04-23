
import { memo } from 'react';
import { ApiNodeType } from '@/lib/api-builder-types';
import { SettingsButton } from '../node-controls/SettingsButton';

interface NodeHeaderProps {
  type: string;
  nodeType: ApiNodeType;
  onSettings: (e: React.MouseEvent) => void;
}

export const NodeHeader = memo(function NodeHeader({ 
  type, 
  nodeType,
  onSettings 
}: NodeHeaderProps) {
  const getNodeColor = (nodeType: string) => {
    const colors: Record<string, string> = {
      input: 'bg-blue-500',
      endpoint: 'bg-green-500',
      transform: 'bg-purple-500',
      auth: 'bg-amber-500',
      ratelimit: 'bg-rose-500',
      cache: 'bg-cyan-500',
      mock: 'bg-indigo-500',
      validator: 'bg-orange-500',
      output: 'bg-emerald-500',
    };
    return colors[nodeType] || 'bg-gray-500';
  };

  return (
    <div className={`${getNodeColor(type)} text-white p-2 rounded-t-md flex justify-between items-center`}>
      <span className="font-medium capitalize">{type}</span>
      <div>
        <SettingsButton 
          nodeType={nodeType} 
          onClick={onSettings} 
          size="sm" 
          variant="ghost"
          label={false}
        />
      </div>
    </div>
  );
});
