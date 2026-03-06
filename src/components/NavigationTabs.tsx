import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, Network, Brain, BarChart3 } from "lucide-react";
import NetworkVisualization from "./NetworkVisualization";
import SupplyChainChatbot from "./SupplyChainChatbot";

interface NavigationTabsProps {
  children: React.ReactNode;
}

const NavigationTabs = ({ children }: NavigationTabsProps) => {
  return (
    <Tabs defaultValue="alerts" className="w-full">
      <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted p-1">
        <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-card">
          <AlertTriangle className="h-4 w-4" />
          Supply Chain Alerts
        </TabsTrigger>
        <TabsTrigger value="network" className="flex items-center gap-2 data-[state=active]:bg-card">
          <Network className="h-4 w-4" />
          Network Visualization
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-card">
          <Brain className="h-4 w-4" />
          AI Insights
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-card">
          <BarChart3 className="h-4 w-4" />
          Advanced Analytics
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="alerts" className="mt-6">
        {children}
      </TabsContent>
      
      <TabsContent value="network" className="mt-6">
        <NetworkVisualization />
      </TabsContent>
      
      <TabsContent value="insights" className="mt-6">
        <SupplyChainChatbot />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-6">
        <div className="bg-card rounded-lg border p-8 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics</h3>
          <p className="text-muted-foreground">Detailed analytics dashboards and reports for Philips supply chain operations would be available here.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default NavigationTabs;
