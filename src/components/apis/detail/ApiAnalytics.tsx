
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ApiAnalytics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Analytics</CardTitle>
        <CardDescription>
          Performance and usage statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">Analytics data is not available for this API yet</p>
          <Button variant="outline" onClick={() => {
            toast({
              title: "Analytics Dashboard",
              description: "Redirecting to Analytics Dashboard...",
            });
            setTimeout(() => navigate("/analytics"), 1000);
          }}>View in Analytics Dashboard</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiAnalytics;
