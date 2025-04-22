
import { Panel } from 'reactflow';
import { ActiveCollaborator } from '@/lib/api-builder-types';

interface CollaboratorsPanelProps {
  collaborators: ActiveCollaborator[];
  currentUserId: string;
}

export function CollaboratorsPanel({ collaborators, currentUserId }: CollaboratorsPanelProps) {
  return (
    <Panel position="top-right">
      {collaborators
        .filter(user => user.id !== currentUserId && user.cursorPosition)
        .map(user => (
          <div
            key={user.id}
            className="absolute pointer-events-none"
            style={{
              left: user.cursorPosition?.x,
              top: user.cursorPosition?.y,
              zIndex: 10,
            }}
          >
            <div className="flex flex-col items-start">
              <div 
                className="h-5 w-5 transform rotate-45"
                style={{ backgroundColor: user.color }}
              />
              <span 
                className="text-xs px-1 rounded text-white -mt-1"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </span>
            </div>
          </div>
        ))}
    </Panel>
  );
}
