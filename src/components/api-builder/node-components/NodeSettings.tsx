
import { memo } from 'react';
import { SettingsButton } from '../node-controls/SettingsButton';
import { ApiNodeType } from '@/lib/api-builder-types';

interface NodeSettingsProps {
  nodeType: ApiNodeType;
  onSettings: (e: React.MouseEvent) => void;
}

export const NodeSettings = memo(function NodeSettings({
  nodeType,
  onSettings
}: NodeSettingsProps) {
  return (
    <div
      className="settings-handle absolute z-10 flex items-center justify-center bg-white/80 dark:bg-background rounded shadow border border-border hover:scale-110 transition-transform"
      style={{ 
        width: 26, 
        height: 26,
        bottom: -13,
        right: -13,
      }}
    >
      <SettingsButton 
        nodeType={nodeType} 
        onClick={onSettings}
        size="icon"
        variant="ghost"
        label={false}
      />
    </div>
  );
});
