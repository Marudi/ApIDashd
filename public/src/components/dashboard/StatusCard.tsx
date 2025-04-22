
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
}

export function StatusCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  variant = "default",
}: StatusCardProps) {
  const variantStyles = {
    default: "",
    success: "border-l-4 border-l-green-500",
    warning: "border-l-4 border-l-yellow-500",
    error: "border-l-4 border-l-red-500",
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium mr-2",
                trend.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <CardDescription className="text-xs text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
