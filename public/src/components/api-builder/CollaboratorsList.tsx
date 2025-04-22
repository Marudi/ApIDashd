
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActiveCollaborator } from "@/lib/api-builder-types";
import { Badge } from "@/components/ui/badge";

interface CollaboratorsListProps {
  collaborators: ActiveCollaborator[];
  currentUserId: string;
}

export function CollaboratorsList({ collaborators, currentUserId }: CollaboratorsListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {collaborators.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="h-8 w-8 border-2" style={{ borderColor: user.color }}>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback style={{ backgroundColor: user.color }}>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span 
              className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-white"
              title="Online"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              {user.id === currentUserId ? 'You' : user.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Editing
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
