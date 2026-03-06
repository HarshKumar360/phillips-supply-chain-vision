import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlertCardProps {
  icon: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  region: string;
  category: string;
  description: string;
  impact: string;
  onViewDetails?: () => void;
}

const AlertCard = ({
  icon,
  title,
  severity,
  region,
  category,
  description,
  impact,
  onViewDetails
}: AlertCardProps) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case "CRITICAL":
        return "bg-critical text-critical-foreground";
      case "HIGH":
        return "bg-high text-high-foreground";
      case "MEDIUM":
        return "bg-medium text-medium-foreground";
    }
  };

  const getCardStyles = () => {
    switch (severity) {
      case "CRITICAL":
        return "border-l-4 border-l-critical";
      case "HIGH":
        return "border-l-4 border-l-high";
      case "MEDIUM":
        return "border-l-4 border-l-medium";
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getCardStyles()}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-foreground text-lg">{title}</h3>
              <Badge className={`${getSeverityStyles()} font-medium`}>
                {severity}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{region}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-medium">{category}</span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
            
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium text-foreground">Impact:</span>{" "}
                <span className="text-muted-foreground">{impact}</span>
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => onViewDetails?.()}
            >
              View Strategy Comparison
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
