import { useState, useMemo } from "react";
import { getAlertContextData } from "@/data/alertContextualData";
import type { StrategyOption } from "@/data/alertContextualData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  Brain, 
  ChevronLeft,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Package,
  MapPin,
  Users,
  Activity,
  ShieldAlert,
  Calendar,
  Layers,
  XCircle,
  Zap
} from "lucide-react";

interface AlertDrilldownProps {
  alert: {
    icon: string;
    title: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM";
    region: string;
    category: string;
    description: string;
    impact: string;
  };
  onBack: () => void;
}

interface StrategyOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  timeline: string;
  riskReduction: number;
  revenueProtection: number;
  feasibility: "HIGH" | "MEDIUM" | "LOW";
  pros: string[];
  cons: string[];
}

const AlertDrilldown = ({ alert, onBack }: AlertDrilldownProps) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const strategyOptions: StrategyOption[] = [
    {
      id: "alternative-sourcing",
      name: "Alternative Sourcing",
      description: "Qualify and onboard backup suppliers from different geographies",
      cost: 4.5,
      timeline: "4-6 weeks",
      riskReduction: 82,
      revenueProtection: 88,
      feasibility: "HIGH",
      pros: ["Diversified supply base", "Proven qualification process", "Long-term resilience"],
      cons: ["Higher unit costs", "Regulatory re-qualification needed", "Lead time for medical-grade validation"]
    },
    {
      id: "inventory-buffer",
      name: "Strategic Safety Stock",
      description: "Increase safety stock for critical medical-grade components",
      cost: 3.2,
      timeline: "1-2 weeks",
      riskReduction: 72,
      revenueProtection: 85,
      feasibility: "HIGH",
      pros: ["Immediate protection", "Simple to implement", "No quality risk"],
      cons: ["Capital intensive", "Warehouse capacity needed", "Obsolescence risk"]
    },
    {
      id: "production-shift",
      name: "Production Line Reallocation",
      description: "Shift production capacity to unaffected manufacturing facilities",
      cost: 1.8,
      timeline: "6-8 weeks",
      riskReduction: 58,
      revenueProtection: 72,
      feasibility: "MEDIUM",
      pros: ["Cost effective", "Utilizes existing validated facilities"],
      cons: ["Regulatory transfer validation", "Limited spare capacity", "Complex logistics"]
    },
    {
      id: "product-prioritization",
      name: "Product Portfolio Prioritization",
      description: "Prioritize high-margin and life-critical product lines",
      cost: 0.5,
      timeline: "1 week",
      riskReduction: 35,
      revenueProtection: 55,
      feasibility: "HIGH",
      pros: ["Minimal cost", "Rapid execution", "Protects critical care products"],
      cons: ["Revenue impact on deprioritized lines", "Customer relationship risk"]
    }
  ];

  const aiRecommendation = {
    strategy: "alternative-sourcing",
    confidence: 89,
    reasoning: "Given the critical severity and €18M revenue impact on MRI system deliveries, alternative sourcing provides the best long-term risk reduction (82%) with strong revenue protection (88%). The 4-6 week timeline aligns with current safety stock buffer. Medical-grade qualification can leverage existing FDA/CE documentation.",
    keyFactors: [
      "Critical impact on life-saving medical equipment",
      "High revenue concentration risk in single geography",
      "Existing pre-qualified suppliers in South Korea available",
      "Regulatory documentation can be expedited via fast-track process"
    ]
  };

  // Comprehensive overview data
  const affectedProducts = [
    { name: "Ingenia Ambition 1.5T", units: 8, revenue: "€4.8M", status: "delayed" },
    { name: "Ingenia Elition 3.0T", units: 6, revenue: "€7.2M", status: "at-risk" },
    { name: "MR 5300", units: 4, revenue: "€2.4M", status: "monitoring" },
    { name: "Incisive CT", units: 3, revenue: "€2.1M", status: "delayed" },
    { name: "IntelliVue MX800", units: 3, revenue: "€1.5M", status: "monitoring" },
  ];

  const timelineEvents = [
    { date: "Feb 15", event: "TSMC allocation cut announced", type: "trigger" },
    { date: "Feb 22", event: "Safety stock buffer activated", type: "action" },
    { date: "Mar 1", event: "Samsung Foundry qualification started", type: "action" },
    { date: "Mar 6", event: "Current date – 14-week buffer remaining", type: "current" },
    { date: "Apr 15", event: "Projected stockout if no action", type: "risk" },
    { date: "May 1", event: "Samsung qualification expected complete", type: "milestone" },
  ];

  const supplierRiskData = [
    { name: "TSMC (Primary)", share: 65, risk: "Critical" },
    { name: "Samsung Foundry", share: 20, risk: "Low" },
    { name: "GlobalFoundries", share: 10, risk: "Medium" },
    { name: "Others", share: 5, risk: "Low" },
  ];

  const impactByRegion = [
    { region: "Europe", revenue: 8.2, systems: 10, percentage: 45 },
    { region: "North America", revenue: 5.4, systems: 8, percentage: 30 },
    { region: "APAC", revenue: 3.2, systems: 4, percentage: 18 },
    { region: "LATAM", revenue: 1.2, systems: 2, percentage: 7 },
  ];

  const weeklyTrendData = [
    { week: "W1", riskScore: 4.2, inventoryWeeks: 18, deliveryDelay: 0 },
    { week: "W2", riskScore: 5.1, inventoryWeeks: 16, deliveryDelay: 1 },
    { week: "W3", riskScore: 6.4, inventoryWeeks: 16, deliveryDelay: 2 },
    { week: "W4", riskScore: 7.8, inventoryWeeks: 14, deliveryDelay: 3 },
    { week: "W5 (Now)", riskScore: 8.2, inventoryWeeks: 14, deliveryDelay: 4 },
    { week: "W6 (Proj)", riskScore: 8.8, inventoryWeeks: 12, deliveryDelay: 6 },
    { week: "W7 (Proj)", riskScore: 9.1, inventoryWeeks: 10, deliveryDelay: 8 },
    { week: "W8 (Proj)", riskScore: 9.5, inventoryWeeks: 8, deliveryDelay: 10 },
  ];

  const PIE_COLORS = ["hsl(0, 84%, 60%)", "hsl(152, 69%, 36%)", "hsl(38, 92%, 50%)", "hsl(210, 18%, 75%)"];

  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const runSimulation = () => {
    if (selectedStrategies.length === 0) return;
    const baseRevenueLoss = 18;
    const results = selectedStrategies.map(strategyId => {
      const strategy = strategyOptions.find(s => s.id === strategyId);
      if (!strategy) return null;
      const protectedRevenue = baseRevenueLoss * (strategy.revenueProtection / 100);
      const roi = ((protectedRevenue - strategy.cost) / strategy.cost) * 100;
      return {
        strategyId,
        strategyName: strategy.name,
        protectedRevenue,
        remainingLoss: baseRevenueLoss - protectedRevenue,
        totalCost: strategy.cost,
        roi,
        netBenefit: protectedRevenue - strategy.cost,
        implementationTimeline: strategy.timeline,
        successProbability: strategy.feasibility === "HIGH" ? 95 : strategy.feasibility === "MEDIUM" ? 80 : 65,
        riskReduction: strategy.riskReduction,
        revenueProtection: strategy.revenueProtection
      };
    }).filter(Boolean);
    setSimulationResults(results as any[]);
  };

  const chartData = useMemo(() => {
    return simulationResults.map(result => ({
      name: result.strategyName.split(' ').slice(0, 2).join(' '),
      'Net Benefit': parseFloat(result.netBenefit.toFixed(1)),
      'Total Cost': result.totalCost,
      'Protected Revenue': parseFloat(result.protectedRevenue.toFixed(1)),
    }));
  }, [simulationResults]);

  const roiComparisonData = useMemo(() => {
    return simulationResults.map(result => ({
      strategy: result.strategyName.split(' ').slice(0, 2).join(' '),
      roi: parseFloat(result.roi.toFixed(0)),
      cost: result.totalCost,
      netBenefit: parseFloat(result.netBenefit.toFixed(1)),
    }));
  }, [simulationResults]);

  const costBreakdownData = useMemo(() => {
    return simulationResults.map(result => ({
      name: result.strategyName.split(' ').slice(0, 2).join(' '),
      'Implementation Cost': result.totalCost,
      'Revenue at Risk (Remaining)': parseFloat(result.remainingLoss.toFixed(1)),
      'Revenue Protected': parseFloat(result.protectedRevenue.toFixed(1)),
    }));
  }, [simulationResults]);

  const radarData = useMemo(() => {
    if (simulationResults.length === 0) return [];
    const metrics = ['Risk Reduction', 'Revenue Protection', 'Success Probability', 'Cost Efficiency', 'Speed'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      simulationResults.forEach(result => {
        const shortName = result.strategyName.split(' ')[0];
        switch(metric) {
          case 'Risk Reduction': dataPoint[shortName] = result.riskReduction; break;
          case 'Revenue Protection': dataPoint[shortName] = result.revenueProtection; break;
          case 'Success Probability': dataPoint[shortName] = result.successProbability; break;
          case 'Cost Efficiency': dataPoint[shortName] = Math.min(100, (result.netBenefit / result.totalCost) * 20); break;
          case 'Speed':
            const weeks = parseInt(result.implementationTimeline.split('-')[0]);
            dataPoint[shortName] = Math.max(0, 100 - (weeks * 12));
            break;
        }
      });
      return dataPoint;
    });
  }, [simulationResults]);

  const paybackData = useMemo(() => {
    return simulationResults.map(result => {
      const weeksStr = result.implementationTimeline.split('-');
      const implWeeks = parseInt(weeksStr[0]);
      const monthlyBenefit = result.netBenefit / 12;
      const paybackMonths = monthlyBenefit > 0 ? (result.totalCost / (result.protectedRevenue / 12)).toFixed(1) : "N/A";
      return {
        strategy: result.strategyName.split(' ').slice(0, 2).join(' '),
        paybackMonths: parseFloat(paybackMonths as string) || 0,
        annualizedROI: parseFloat(result.roi.toFixed(0)),
        implWeeks,
      };
    });
  }, [simulationResults]);

  const getSeverityColor = () => {
    switch (alert.severity) {
      case "CRITICAL": return "text-critical";
      case "HIGH": return "text-high";
      case "MEDIUM": return "text-medium";
    }
  };

  const getSeverityBg = () => {
    switch (alert.severity) {
      case "CRITICAL": return "bg-critical text-critical-foreground";
      case "HIGH": return "bg-high text-high-foreground";
      case "MEDIUM": return "bg-medium text-medium-foreground";
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "HIGH": return "text-success";
      case "MEDIUM": return "text-warning";
      case "LOW": return "text-critical";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delayed": return "bg-critical/10 text-critical border-critical/20";
      case "at-risk": return "bg-high/10 text-high border-high/20";
      case "monitoring": return "bg-medium/10 text-medium border-medium/20";
      default: return "";
    }
  };

  // AI Insights cost/ROI data for all strategies
  const aiCostAnalysis = strategyOptions.map(s => {
    const protectedRev = 18 * (s.revenueProtection / 100);
    const roi = ((protectedRev - s.cost) / s.cost) * 100;
    const netBenefit = protectedRev - s.cost;
    const monthlyProtection = protectedRev / 12;
    const paybackMonths = s.cost / monthlyProtection;
    return {
      ...s,
      protectedRevenue: protectedRev,
      roi,
      netBenefit,
      paybackMonths,
      annualizedSavings: netBenefit,
      costPerPercent: s.cost / s.riskReduction,
    };
  });

  const recommendedStrategy = aiCostAnalysis.find(s => s.id === aiRecommendation.strategy)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{alert.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{alert.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getSeverityBg()}>
                {alert.severity}
              </Badge>
              <span className="text-muted-foreground">{alert.region}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-medium">{alert.category}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategic Options</TabsTrigger>
          <TabsTrigger value="simulation">Simulation & ROI</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* ========== COMPREHENSIVE OVERVIEW ========== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Top KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-critical/20 bg-critical/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-critical" />
                  <span className="text-xs font-medium text-muted-foreground">Revenue at Risk</span>
                </div>
                <p className="text-2xl font-bold text-critical">€18M</p>
                <p className="text-xs text-muted-foreground mt-1">Across {affectedProducts.reduce((sum, p) => sum + p.units, 0)} systems</p>
              </CardContent>
            </Card>
            <Card className="border-high/20 bg-high/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-high" />
                  <span className="text-xs font-medium text-muted-foreground">Time to Impact</span>
                </div>
                <p className="text-2xl font-bold text-high">8 weeks</p>
                <p className="text-xs text-muted-foreground mt-1">Projected stockout date: Apr 15</p>
              </CardContent>
            </Card>
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-warning" />
                  <span className="text-xs font-medium text-muted-foreground">Safety Stock Buffer</span>
                </div>
                <p className="text-2xl font-bold text-warning">14 weeks</p>
                <p className="text-xs text-muted-foreground mt-1">Depleting at 1.5 weeks/week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
                </div>
                <p className="text-2xl font-bold text-foreground">8.2<span className="text-sm font-normal text-muted-foreground">/10</span></p>
                <p className="text-xs text-critical mt-1">↑ 4.0 from 4 weeks ago</p>
              </CardContent>
            </Card>
          </div>

          {/* Alert Details + Supplier Risk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Alert Details & Root Cause
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{alert.description}</p>
                <Separator />
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium text-foreground mb-2">Business Impact</h4>
                  <p className="text-sm text-muted-foreground">{alert.impact}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-foreground mb-3">Root Cause Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-muted/20 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Primary Cause</p>
                      <p className="text-sm font-medium text-foreground">Consumer electronics demand surge (+40% YoY) consuming medical-grade fab capacity</p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Contributing Factor</p>
                      <p className="text-sm font-medium text-foreground">Geopolitical tensions increasing supply concentration risk in Taiwan</p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Dependency Risk</p>
                      <p className="text-sm font-medium text-foreground">65% of medical-grade ASICs sourced from single fab (TSMC N7 process)</p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Regulatory Impact</p>
                      <p className="text-sm font-medium text-foreground">Alternative suppliers require 8-12 week FDA/CE re-qualification cycle</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Supplier Concentration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={supplierRiskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="share"
                      label={({ name, share }) => `${share}%`}
                    >
                      {supplierRiskData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {supplierRiskData.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <Badge variant="outline" className={s.risk === "Critical" ? "border-critical text-critical" : s.risk === "Medium" ? "border-warning text-warning" : "border-success text-success"}>
                        {s.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Risk Escalation Trend & Inventory Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Weeks of Stock', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="riskScore" name="Risk Score" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="inventoryWeeks" name="Inventory (Weeks)" stroke="hsl(207, 90%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="left" type="monotone" dataKey="deliveryDelay" name="Delivery Delay (Weeks)" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Affected Products + Regional Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Affected Product Lines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {affectedProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.units} units • {product.revenue}</p>
                      </div>
                      <Badge variant="outline" className={getStatusBadge(product.status)}>
                        {product.status === "at-risk" ? "At Risk" : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Impact by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactByRegion.map((region, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{region.region}</span>
                        <span className="text-muted-foreground">€{region.revenue}M • {region.systems} systems</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{region.percentage}% of total impact</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {timelineEvents.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                        event.type === "trigger" ? "bg-critical text-critical-foreground" :
                        event.type === "action" ? "bg-primary text-primary-foreground" :
                        event.type === "current" ? "bg-foreground text-background" :
                        event.type === "risk" ? "bg-high text-high-foreground" :
                        "bg-success text-success-foreground"
                      }`}>
                        {event.type === "trigger" ? <AlertTriangle className="h-3.5 w-3.5" /> :
                         event.type === "action" ? <Zap className="h-3.5 w-3.5" /> :
                         event.type === "current" ? <Activity className="h-3.5 w-3.5" /> :
                         event.type === "risk" ? <XCircle className="h-3.5 w-3.5" /> :
                         <CheckCircle className="h-3.5 w-3.5" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-xs text-muted-foreground font-medium">{event.date}</p>
                        <p className={`text-sm ${event.type === "current" ? "font-bold text-foreground" : "text-foreground"}`}>{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== STRATEGIES ========== */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {strategyOptions.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <Badge className={getFeasibilityColor(strategy.feasibility)}>
                      {strategy.feasibility}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="ml-2 font-medium">€{strategy.cost}M</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="ml-2 font-medium">{strategy.timeline}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk Reduction:</span>
                      <span className="ml-2 font-medium">{strategy.riskReduction}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue Protection:</span>
                      <span className="ml-2 font-medium">{strategy.revenueProtection}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-success">Pros:</span>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {strategy.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-critical">Cons:</span>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {strategy.cons.map((con, index) => <li key={index}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={strategy.id}
                      checked={selectedStrategies.includes(strategy.id)}
                      onCheckedChange={() => toggleStrategy(strategy.id)}
                    />
                    <label htmlFor={strategy.id} className="text-sm font-medium leading-none cursor-pointer">
                      Include in comparison
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedStrategies.length > 0 && (
            <div className="flex justify-center">
              <Button size="lg" onClick={runSimulation}>
                Run Simulation ({selectedStrategies.length} {selectedStrategies.length === 1 ? 'Strategy' : 'Strategies'})
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ========== SIMULATION & ROI ========== */}
        <TabsContent value="simulation" className="space-y-6">
          {simulationResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Simulation Run</h3>
                <p className="text-muted-foreground">Select one or more strategies from the Strategic Options tab and click "Run Simulation"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-7 w-7 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">
                      €{Math.max(...simulationResults.map(r => r.protectedRevenue)).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">Best Revenue Protection</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-7 w-7 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.max(...simulationResults.map(r => r.roi)).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Highest ROI</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-7 w-7 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      €{Math.max(...simulationResults.map(r => r.netBenefit)).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">Best Net Benefit</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      €{simulationResults.reduce((sum, r) => sum + r.totalCost, 0).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">Total Investment (All Selected)</div>
                  </CardContent>
                </Card>
              </div>

              {/* ROI Comparison - Side by Side Bar */}
              <Card>
                <CardHeader>
                  <CardTitle>ROI Comparison – Selected Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={roiComparisonData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" />
                      <YAxis yAxisId="left" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: '€M', angle: 90, position: 'insideRight' }} />
                      <Tooltip formatter={(value: number, name: string) => [name === 'roi' ? `${value}%` : `€${value}M`, name === 'roi' ? 'ROI' : name === 'cost' ? 'Cost' : 'Net Benefit']} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="roi" name="ROI (%)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="cost" name="Cost (€M)" fill="hsl(var(--critical))" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="netBenefit" name="Net Benefit (€M)" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost vs Revenue Protection Stacked */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Impact Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={costBreakdownData} layout="vertical" barCategoryGap="15%">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" label={{ value: '€M', position: 'insideBottom', offset: -5 }} />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Revenue Protected" stackId="a" fill="hsl(var(--success))" />
                      <Bar dataKey="Implementation Cost" stackId="a" fill="hsl(var(--critical))" />
                      <Bar dataKey="Revenue at Risk (Remaining)" fill="hsl(var(--warning))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar + Payback side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Dimensional Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        {simulationResults.map((result, index) => {
                          const colors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--high))'];
                          return (
                            <Radar key={result.strategyId} name={result.strategyName.split(' ')[0]} dataKey={result.strategyName.split(' ')[0]} stroke={colors[index % colors.length]} fill={colors[index % colors.length]} fillOpacity={0.3} />
                          );
                        })}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payback Period Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={paybackData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value: number, name: string) => [name === 'paybackMonths' ? `${value} months` : `${value} weeks`, name === 'paybackMonths' ? 'Payback Period' : 'Implementation Time']} />
                        <Legend />
                        <Bar dataKey="paybackMonths" name="Payback (Months)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="implWeeks" name="Implementation (Weeks)" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Strategy Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Strategy</th>
                          <th className="text-right py-3 px-2 font-medium">Cost</th>
                          <th className="text-right py-3 px-2 font-medium">Protected Rev.</th>
                          <th className="text-right py-3 px-2 font-medium">Net Benefit</th>
                          <th className="text-right py-3 px-2 font-medium">ROI</th>
                          <th className="text-right py-3 px-2 font-medium">Timeline</th>
                          <th className="text-right py-3 px-2 font-medium">Success Rate</th>
                          <th className="text-right py-3 px-2 font-medium">Risk Red.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationResults.map((result) => (
                          <tr key={result.strategyId} className="border-b hover:bg-muted/30">
                            <td className="py-3 px-2 font-medium">{result.strategyName}</td>
                            <td className="text-right py-3 px-2">€{result.totalCost}M</td>
                            <td className="text-right py-3 px-2 text-success">€{result.protectedRevenue.toFixed(1)}M</td>
                            <td className="text-right py-3 px-2 font-medium text-primary">€{result.netBenefit.toFixed(1)}M</td>
                            <td className="text-right py-3 px-2 font-bold text-success">{result.roi.toFixed(0)}%</td>
                            <td className="text-right py-3 px-2">{result.implementationTimeline}</td>
                            <td className="text-right py-3 px-2">{result.successProbability}%</td>
                            <td className="text-right py-3 px-2">{result.riskReduction}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ========== AI INSIGHTS with Cost & ROI ========== */}
        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Recommendation Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Recommended Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {recommendedStrategy.name}
                </span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {aiRecommendation.confidence}% Confidence
                </Badge>
              </div>
              
              <p className="text-muted-foreground">{aiRecommendation.reasoning}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Key Decision Factors:</h4>
                <ul className="space-y-1">
                  {aiRecommendation.keyFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedStrategies([aiRecommendation.strategy]);
                  setTimeout(() => runSimulation(), 100);
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Simulate AI Recommendation
              </Button>
            </CardContent>
          </Card>

          {/* Recommended Strategy Financial Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-7 w-7 text-critical mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">€{recommendedStrategy.cost}M</div>
                <div className="text-xs text-muted-foreground">Implementation Cost</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-7 w-7 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">€{recommendedStrategy.protectedRevenue.toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">Revenue Protected</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-7 w-7 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{recommendedStrategy.roi.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Expected ROI</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-7 w-7 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{recommendedStrategy.paybackMonths.toFixed(1)}mo</div>
                <div className="text-xs text-muted-foreground">Payback Period</div>
              </CardContent>
            </Card>
          </div>

          {/* Full Strategy Cost & ROI Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost of Implementation & ROI – All Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-3 font-medium text-sm">Strategy</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">Impl. Cost</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">Revenue Protected</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">Net Benefit</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">ROI</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">Payback</th>
                      <th className="text-right py-3 px-3 font-medium text-sm">Cost/% Risk Red.</th>
                      <th className="text-center py-3 px-3 font-medium text-sm">AI Pick</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiCostAnalysis.sort((a, b) => b.roi - a.roi).map((s) => (
                      <tr key={s.id} className={`border-b hover:bg-muted/20 ${s.id === aiRecommendation.strategy ? "bg-primary/5" : ""}`}>
                        <td className="py-3 px-3">
                          <div className="font-medium text-sm">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.timeline} • {s.feasibility} feasibility</div>
                        </td>
                        <td className="text-right py-3 px-3 font-medium">€{s.cost}M</td>
                        <td className="text-right py-3 px-3 text-success font-medium">€{s.protectedRevenue.toFixed(1)}M</td>
                        <td className="text-right py-3 px-3 text-primary font-bold">€{s.netBenefit.toFixed(1)}M</td>
                        <td className="text-right py-3 px-3">
                          <span className={`font-bold ${s.roi > 200 ? "text-success" : s.roi > 100 ? "text-primary" : "text-foreground"}`}>
                            {s.roi.toFixed(0)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-3 text-sm">{s.paybackMonths.toFixed(1)} mo</td>
                        <td className="text-right py-3 px-3 text-sm text-muted-foreground">€{(s.costPerPercent * 1000).toFixed(0)}K</td>
                        <td className="text-center py-3 px-3">
                          {s.id === aiRecommendation.strategy && (
                            <Badge className="bg-primary text-primary-foreground text-xs">Recommended</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ROI Visual Chart for AI Tab */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI by Strategy (AI Analysis)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiCostAnalysis.sort((a, b) => b.roi - a.roi).map(s => ({
                    name: s.name.split(' ').slice(0, 2).join(' '),
                    ROI: parseFloat(s.roi.toFixed(0)),
                    isRecommended: s.id === aiRecommendation.strategy,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'ROI']} />
                    <Bar dataKey="ROI" radius={[4, 4, 0, 0]}>
                      {aiCostAnalysis.sort((a, b) => b.roi - a.roi).map((s, i) => (
                        <Cell key={i} fill={s.id === aiRecommendation.strategy ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} opacity={s.id === aiRecommendation.strategy ? 1 : 0.5} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost vs. Net Benefit</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiCostAnalysis.sort((a, b) => b.netBenefit - a.netBenefit).map(s => ({
                    name: s.name.split(' ').slice(0, 2).join(' '),
                    Cost: s.cost,
                    'Net Benefit': parseFloat(s.netBenefit.toFixed(1)),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: '€M', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => [`€${value}M`]} />
                    <Legend />
                    <Bar dataKey="Cost" fill="hsl(var(--critical))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Net Benefit" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Investment Summary */}
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Investment Summary – AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Supplier qualification</span><span className="font-medium">€1.8M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Regulatory fast-track</span><span className="font-medium">€0.9M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Logistics setup</span><span className="font-medium">€0.6M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Quality validation</span><span className="font-medium">€0.8M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Contingency (10%)</span><span className="font-medium">€0.4M</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold"><span>Total</span><span>€{recommendedStrategy.cost}M</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Revenue Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Revenue at risk</span><span className="font-medium text-critical">€18.0M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Revenue protected ({recommendedStrategy.revenueProtection}%)</span><span className="font-medium text-success">€{recommendedStrategy.protectedRevenue.toFixed(1)}M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Residual risk</span><span className="font-medium text-warning">€{(18 - recommendedStrategy.protectedRevenue).toFixed(1)}M</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">Net benefit</span><span className="font-bold text-success">€{recommendedStrategy.netBenefit.toFixed(1)}M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Return on investment</span><span className="font-bold text-primary">{recommendedStrategy.roi.toFixed(0)}%</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Key Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Implementation</span><span className="font-medium">{recommendedStrategy.timeline}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Payback period</span><span className="font-medium">{recommendedStrategy.paybackMonths.toFixed(1)} months</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Risk reduction</span><span className="font-medium">{recommendedStrategy.riskReduction}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Success probability</span><span className="font-medium">95%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Cost per 1% risk reduction</span><span className="font-medium">€{(recommendedStrategy.costPerPercent * 1000).toFixed(0)}K</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertDrilldown;
