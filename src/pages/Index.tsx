import { useState } from "react";
import Header from "@/components/Header";
import MetricsCard from "@/components/MetricsCard";
import AlertCard from "@/components/AlertCard";
import AlertDrilldown from "@/components/AlertDrilldown";
import NavigationTabs from "@/components/NavigationTabs";
import { AlertTriangle, Clock, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const alerts = [
    {
      icon: "🔬",
      title: "Semiconductor Shortage – TSMC Allocation Cut",
      severity: "CRITICAL" as const,
      region: "APAC",
      category: "Diagnosis & Treatment",
      description: "TSMC has reduced medical-grade chip allocation by 15% due to surging consumer electronics demand, directly affecting MRI and CT system production",
      impact: "Ingenia MRI and Incisive CT production at risk. 24 systems delayed. €18M revenue impact projected over next quarter."
    },
    {
      icon: "🧲",
      title: "Rare Earth Price Surge – Neodymium +22%",
      severity: "HIGH" as const,
      region: "Global",
      category: "Diagnosis & Treatment",
      description: "China export restrictions driving neodymium prices up 22% YoY, affecting superconducting magnet production for MRI systems",
      impact: "MRI magnet costs up €120K per unit. Annual margin impact of €8.5M across Ingenia product line."
    },
    {
      icon: "🏥",
      title: "Gradient Coil Supplier Delays – Germany",
      severity: "HIGH" as const,
      region: "Europe",
      category: "Diagnosis & Treatment",
      description: "Key gradient coil supplier in Erlangen experiencing production delays due to specialist labor shortages",
      impact: "12 Ingenia Elition 3.0T systems delayed by 8 weeks. €7.2M in deferred customer deliveries."
    },
    {
      icon: "🚢",
      title: "Suez Canal Rerouting – Logistics Cost Spike",
      severity: "HIGH" as const,
      region: "Global",
      category: "All Business Units",
      description: "Red Sea security situation forcing container ships via Cape of Good Hope, adding 12 days transit time",
      impact: "€2.4M additional logistics cost per quarter. APAC-to-Europe shipments of patient monitors delayed 2 weeks."
    },
    {
      icon: "📱",
      title: "Patient Monitor Display Panel Shortage",
      severity: "MEDIUM" as const,
      region: "APAC",
      category: "Connected Care",
      description: "Medical-grade LCD panel supplier in South Korea facing yield issues on 15-inch displays for IntelliVue monitors",
      impact: "IntelliVue MX800 production reduced 20%. Alternative panel qualification underway with Corning."
    },
    {
      icon: "🏭",
      title: "Zhuhai Factory – Equipment Maintenance",
      severity: "MEDIUM" as const,
      region: "APAC",
      category: "Personal Health",
      description: "Planned maintenance on Sonicare production line #4 extended due to motor calibration issues",
      impact: "Sonicare DiamondClean production reduced 15% for 3 weeks. Shifting orders to line #2 and #3."
    },
    {
      icon: "🔋",
      title: "Battery Cell Supply Constraint – Lumify",
      severity: "MEDIUM" as const,
      region: "North America",
      category: "Diagnosis & Treatment",
      description: "Medical-grade lithium-ion battery supplier facing capacity constraints for portable ultrasound devices",
      impact: "Lumify handheld ultrasound production capped at 80% capacity. 6-week lead time extension."
    },
    {
      icon: "❄️",
      title: "Helium Supply Stability – BLR Plant",
      severity: "MEDIUM" as const,
      region: "North America",
      category: "Diagnosis & Treatment",
      description: "Bureau of Land Management helium reserve allocation reduced, affecting legacy MRI system cooling",
      impact: "Legacy MRI service contracts affected. Accelerating customer migration to helium-free Ambition systems."
    }
  ];

  if (selectedAlert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6">
          <AlertDrilldown 
            alert={selectedAlert} 
            onBack={() => setSelectedAlert(null)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Active Alerts"
            value={8}
            change="+2 from last week"
            changeType="increase"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="warning"
          />
          <MetricsCard
            title="Risk Score"
            value="7.2"
            change="-0.8 from last week"
            changeType="decrease"
            icon={<Shield className="h-5 w-5" />}
            variant="success"
          />
          <MetricsCard
            title="Supply Continuity"
            value="94%"
            change="+2% from last week"
            changeType="increase"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="success"
          />
          <MetricsCard
            title="Response Time"
            value="1.8h"
            change="-0.6h from last week"
            changeType="decrease"
            icon={<Clock className="h-5 w-5" />}
            variant="success"
          />
        </div>

        {/* Navigation Tabs and Content */}
        <NavigationTabs>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Active Supply Chain Alerts</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {alerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  {...alert}
                  onViewDetails={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          </div>
        </NavigationTabs>
      </main>
    </div>
  );
};

export default Index;
