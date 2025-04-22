
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricsCardProps {
  title: string;
  description: string;
  currentValue: number;
  nodeData?: Array<{
    name: string;
    value: number;
  }>;
}

export function MetricsCard({ title, description, currentValue, nodeData }: MetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current</span>
              <span className={`text-sm font-medium ${currentValue > 75 ? "text-yellow-500" : "text-green-500"}`}>
                {currentValue}%
              </span>
            </div>
            <Progress 
              value={currentValue}
              className={currentValue > 75 ? "bg-yellow-100 h-2" : "bg-green-100 h-2"}
            />
          </div>
          {nodeData && (
            <div>
              <h4 className="text-sm font-medium mb-1">By Node</h4>
              <div className="space-y-2">
                {nodeData.map((node, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{node.name}</span>
                      <span className={node.value > 75 ? "text-yellow-500" : "text-green-500"}>
                        {node.value}%
                      </span>
                    </div>
                    <Progress 
                      value={node.value}
                      className={node.value > 75 ? "bg-yellow-100 h-1" : "bg-green-100 h-1"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
