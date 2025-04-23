
import { memo } from 'react';
import { ApiNodeType, ApiNodeData } from '@/lib/api-builder-types';
import { SettingsButton } from '../node-controls/SettingsButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, Wrench } from 'lucide-react';

interface NodeSettingsProps {
  nodeType: ApiNodeType;
  onSettings: (e: React.MouseEvent) => void;
  data?: ApiNodeData;
}

export const NodeSettings = memo(function NodeSettings({
  nodeType,
  onSettings,
  data
}: NodeSettingsProps) {
  const handleQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleFullSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSettings(e);
  };

  const getQuickSettingsContent = () => {
    switch (nodeType) {
      case 'endpoint':
        return (
          <div className="space-y-2 p-2">
            <h4 className="text-sm font-medium">Quick Settings</h4>
            <div className="text-xs text-muted-foreground">
              <p>URL: {data?.url || 'Not set'}</p>
              <p>Method: {data?.method || 'GET'}</p>
            </div>
          </div>
        );
      case 'transform':
        return (
          <div className="space-y-2 p-2">
            <h4 className="text-sm font-medium">Transform Settings</h4>
            <div className="text-xs text-muted-foreground">
              <p>Type: {data?.transformType || 'json'}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2 p-2">
            <h4 className="text-sm font-medium">{nodeType} Settings</h4>
            <div className="text-xs text-muted-foreground">
              <p>Label: {data?.label || nodeType}</p>
            </div>
          </div>
        );
    }
  };

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="!p-0 !h-auto !w-auto hover:bg-transparent"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60" side="right">
          {getQuickSettingsContent()}
          <div className="border-t mt-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={handleFullSettings}
            >
              <Wrench className="mr-2 h-4 w-4" />
              Open Full Settings
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
