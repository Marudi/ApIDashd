
import { Badge } from "@/components/ui/badge";

interface ApiKeyStatusBadgeProps {
  status: "active" | "inactive" | "revoked";
  isExpired: boolean;
}

export const ApiKeyStatusBadge = ({ status, isExpired }: ApiKeyStatusBadgeProps) => (
  <Badge 
    variant={status === "active" && !isExpired ? "default" : "destructive"}
    className={status === "active" && !isExpired ? "bg-green-500" : ""}
  >
    {isExpired ? "expired" : status}
  </Badge>
);
