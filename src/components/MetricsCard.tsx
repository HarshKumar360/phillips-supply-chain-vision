import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "increase" | "decrease";
  icon?: React.ReactNode;
  variant?: "default" | "warning" | "success" | "critical";
}

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon,
  variant = "default" 
}: MetricsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "success":
        return "border-success/20 bg-success/5";
      case "critical":
        return "border-critical/20 bg-critical/5";
      default:
        return "border-border";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "warning":
        return "text-warning";
      case "success":
        return "text-success";
      case "critical":
        return "text-critical";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendColor = () => {
    if (variant === "critical" || variant === "warning") {
      return changeType === "decrease" ? "text-success" : "text-critical";
    }
    return changeType === "increase" ? "text-success" : "text-muted-foreground";
  };

  return (
    <Card className={`${getVariantStyles()} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className={getIconColor()}>
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {changeType === "increase" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
