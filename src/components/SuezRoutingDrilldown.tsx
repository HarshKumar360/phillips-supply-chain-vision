import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import {
  ChevronLeft, Brain, Truck, Train, Ship, Plane, AlertTriangle, CheckCircle,
  Clock, DollarSign, TrendingUp, Target, Activity, CloudRain, MapPin,
  Zap, ArrowRight, RefreshCw, ShieldAlert, Waves, Wind, Thermometer,
  Route, Package, BarChart3, Gauge
} from "lucide-react";

interface SuezRoutingDrilldownProps {
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

// ─── Real-time Signal Data ───
const LIVE_SIGNALS = {
  traffic: [
    { corridor: "Rotterdam → Eindhoven", status: "clear", delay: 0, mode: "road" },
    { corridor: "Hamburg → Rotterdam", status: "congested", delay: 45, mode: "road" },
    { corridor: "Singapore → Rotterdam (Suez)", status: "blocked", delay: 288, mode: "sea" },
    { corridor: "Singapore → Rotterdam (Cape)", status: "active", delay: 0, mode: "sea" },
    { corridor: "Duisburg → Rotterdam", status: "clear", delay: 0, mode: "rail" },
    { corridor: "Istanbul → Vienna (Rail)", status: "minor-delay", delay: 12, mode: "rail" },
  ],
  weather: [
    { region: "Red Sea", condition: "Sandstorms", severity: "HIGH", icon: Wind, impact: "Visibility <2km, port ops suspended" },
    { region: "Cape of Good Hope", condition: "Heavy Swells", severity: "MEDIUM", icon: Waves, impact: "6m swells, 15% speed reduction" },
    { region: "Central Europe", condition: "Clear", severity: "LOW", icon: Thermometer, impact: "Optimal road & rail conditions" },
    { region: "Mediterranean", condition: "Storms", severity: "HIGH", icon: CloudRain, impact: "Port of Piraeus delays expected" },
  ],
  vehicleAvailability: [
    { type: "Container Ships (Cape Route)", available: 12, total: 18, utilization: 67 },
    { type: "40ft Containers (Rail)", available: 340, total: 500, utilization: 68 },
    { type: "Refrigerated Trucks (EU)", available: 28, total: 45, utilization: 62 },
    { type: "Cargo Aircraft (Express)", available: 3, total: 8, utilization: 63 },
  ],
  transportCapacity: [
    { mode: "Sea (Cape Route)", capacity: 82, trend: "decreasing", weeklyChange: -4 },
    { mode: "Rail (China-Europe)", capacity: 71, trend: "stable", weeklyChange: 0 },
    { mode: "Air Freight", capacity: 45, trend: "increasing", weeklyChange: +8 },
    { mode: "Road (Intra-EU)", capacity: 91, trend: "stable", weeklyChange: -1 },
  ],
};

// ─── Transport Mode Strategies ───
interface TransportStrategy {
  id: string;
  name: string;
  icon: React.ReactNode;
  modeEmoji: string;
  modes: string[];
  description: string;
  transitTime: string;
  originalTransit: string;
  cost: number;
  costVsOriginal: string;
  co2Impact: string;
  reliability: number;
  capacity: string;
  riskReduction: number;
  revenueProtection: number;
  feasibility: "HIGH" | "MEDIUM" | "LOW";
  aiConfidence: number;
  realTimeFactors: string[];
  route: string[];
  pros: string[];
  cons: string[];
}

const TRANSPORT_STRATEGIES: TransportStrategy[] = [
  {
    id: "sea-cape",
    name: "Sea Reroute (Cape of Good Hope)",
    icon: <Ship className="h-5 w-5" />,
    modeEmoji: "🚢",
    modes: ["Sea"],
    description: "Full maritime reroute via Cape of Good Hope, avoiding Suez Canal entirely. Adds ~12 days transit.",
    transitTime: "38-42 days",
    originalTransit: "26-30 days",
    cost: 1.8,
    costVsOriginal: "+35%",
    co2Impact: "+28% emissions",
    reliability: 78,
    capacity: "Full container loads",
    riskReduction: 65,
    revenueProtection: 72,
    feasibility: "HIGH",
    aiConfidence: 72,
    realTimeFactors: [
      "Cape route experiencing 6m swells – 15% speed reduction",
      "12 of 18 container ships available for rerouting",
      "Fuel costs up 18% due to longer route",
    ],
    route: ["Singapore", "Strait of Malacca", "Indian Ocean", "Cape of Good Hope", "West Africa Coast", "Rotterdam"],
    pros: ["No mode change needed", "Full container capacity maintained", "Existing shipping contracts"],
    cons: ["12 extra days transit", "Higher fuel costs", "Weather risk at Cape", "Insurance premium increase"],
  },
  {
    id: "rail-road",
    name: "Rail + Truck Hybrid",
    icon: <Train className="h-5 w-5" />,
    modeEmoji: "🚆🚚",
    modes: ["Rail", "Road"],
    description: "Ship to APAC rail hub, China-Europe Express rail to Duisburg, then truck distribution to Philips facilities.",
    transitTime: "18-22 days",
    originalTransit: "26-30 days",
    cost: 2.4,
    costVsOriginal: "+65%",
    co2Impact: "-12% emissions",
    reliability: 85,
    capacity: "40ft containers, 340 available",
    riskReduction: 88,
    revenueProtection: 92,
    feasibility: "HIGH",
    aiConfidence: 94,
    realTimeFactors: [
      "China-Europe Express: 71% capacity, stable availability",
      "Duisburg → Rotterdam corridor clear, no delays",
      "340 of 500 rail containers available this week",
      "Central Europe weather: clear, optimal for road transport",
    ],
    route: ["Singapore", "Shenzhen Port", "Chongqing Rail Hub", "Kazakhstan", "Poland", "Duisburg", "Rotterdam/Eindhoven"],
    pros: ["8-12 days faster than Cape route", "Lower emissions", "Avoids all maritime chokepoints", "High reliability"],
    cons: ["Higher per-unit cost", "Container size limitations", "Border crossing documentation", "Limited for oversized medical equipment"],
  },
  {
    id: "air-truck",
    name: "Air Express + Last-Mile Truck",
    icon: <Plane className="h-5 w-5" />,
    modeEmoji: "✈️🚚",
    modes: ["Air", "Road"],
    description: "Air freight critical components from Singapore to Amsterdam Schiphol, then truck to Philips facilities. For urgent, high-value shipments.",
    transitTime: "3-5 days",
    originalTransit: "26-30 days",
    cost: 8.2,
    costVsOriginal: "+340%",
    co2Impact: "+680% emissions",
    reliability: 95,
    capacity: "Limited – 3 cargo aircraft available",
    riskReduction: 95,
    revenueProtection: 98,
    feasibility: "MEDIUM",
    aiConfidence: 88,
    realTimeFactors: [
      "Only 3 of 8 cargo aircraft available – capacity constrained",
      "Air freight capacity trending up (+8% this week)",
      "Schiphol handling capacity: adequate for medical cargo",
      "Priority handling available for medical-grade equipment",
    ],
    route: ["Singapore Changi", "Amsterdam Schiphol", "Truck to Eindhoven/Best"],
    pros: ["Fastest option by far", "Highest reliability", "Priority for medical devices", "Weather-independent"],
    cons: ["Extremely expensive", "Very limited capacity", "High carbon footprint", "Only viable for critical components"],
  },
  {
    id: "multimodal-split",
    name: "AI-Optimized Multimodal Split",
    icon: <Brain className="h-5 w-5" />,
    modeEmoji: "🧠🚆✈️🚚",
    modes: ["Rail", "Air", "Road"],
    description: "AI agent dynamically splits shipment: critical MRI components via air, bulk supplies via rail+truck. Continuously re-optimized based on real-time signals.",
    transitTime: "3-22 days (mixed)",
    originalTransit: "26-30 days",
    cost: 4.6,
    costVsOriginal: "+120%",
    co2Impact: "+45% emissions",
    reliability: 92,
    capacity: "Optimized allocation across modes",
    riskReduction: 93,
    revenueProtection: 96,
    feasibility: "HIGH",
    aiConfidence: 97,
    realTimeFactors: [
      "AI agent analyzing 847 real-time data points across all modes",
      "Dynamic allocation: 15% air (critical), 65% rail, 20% road",
      "Continuous re-optimization every 4 hours based on signal changes",
      "Weather models predict Cape swells clearing in 72h – may shift more to sea",
    ],
    route: ["Singapore → (Split)", "Critical: Changi → Schiphol → Truck", "Bulk: Shenzhen → Rail → Duisburg → Truck", "Overflow: Road distribution across EU hubs"],
    pros: ["Best cost-to-speed ratio", "Adapts in real-time", "Protects critical shipments", "AI-optimized continuously"],
    cons: ["Complex coordination", "Requires AI system integration", "Multiple handoff points", "Higher management overhead"],
  },
];

// ─── Agent Decision Log ───
const AGENT_DECISIONS = [
  { time: "09:14", agent: "Route Optimizer", action: "Detected Suez Canal blockage – initiated multimodal analysis", signal: "Maritime AIS data", priority: "CRITICAL" },
  { time: "09:18", agent: "Weather Analyst", action: "Red Sea sandstorms confirmed – elevated Cape route weather risk", signal: "ECMWF weather model", priority: "HIGH" },
  { time: "09:22", agent: "Capacity Planner", action: "Reserved 3 cargo aircraft slots at Changi for critical MRI components", signal: "Airline capacity API", priority: "HIGH" },
  { time: "09:25", agent: "Cost Optimizer", action: "Calculated multimodal split: 15% air, 65% rail, 20% road – best cost/speed ratio", signal: "Freight rate feeds", priority: "MEDIUM" },
  { time: "09:31", agent: "Risk Assessor", action: "Rail corridor Kazakhstan-Poland clear, border processing <4h", signal: "Customs data feed", priority: "LOW" },
  { time: "09:38", agent: "Route Optimizer", action: "Shifted 8% of bulk from rail to road – Duisburg terminal approaching capacity", signal: "Terminal utilization IoT", priority: "MEDIUM" },
  { time: "09:45", agent: "Weather Analyst", action: "Mediterranean storm forecast downgraded – Piraeus port reopening in 6h", signal: "Port authority API", priority: "LOW" },
  { time: "09:52", agent: "Shipment Tracker", action: "15 IntelliVue monitor pallets cleared Changi customs – boarding cargo flight CX7742", signal: "Customs clearance API", priority: "HIGH" },
];

// ─── ROI Comparison Data ───
const ROI_DATA = [
  { name: "Sea (Cape)", cost: 1.8, revenueProtected: 1.73, netBenefit: -0.07, roi: -4, transitDays: 40 },
  { name: "Rail+Truck", cost: 2.4, revenueProtected: 2.21, netBenefit: -0.19, roi: -8, transitDays: 20 },
  { name: "Air+Truck", cost: 8.2, revenueProtected: 2.35, netBenefit: -5.85, roi: -71, transitDays: 4 },
  { name: "AI Multimodal", cost: 4.6, revenueProtected: 2.30, netBenefit: -2.30, roi: -50, transitDays: 12 },
];

const COST_PER_DAY_SAVED = [
  { name: "Sea (Cape)", daysReduced: 0, costPerDay: 0 },
  { name: "Rail+Truck", daysReduced: 20, costPerDay: 0.03 },
  { name: "Air+Truck", daysReduced: 36, costPerDay: 0.18 },
  { name: "AI Multimodal", daysReduced: 28, costPerDay: 0.10 },
];

const RADAR_STRATEGIES = [
  { metric: "Speed", "Sea Cape": 25, "Rail+Truck": 65, "Air Express": 98, "AI Multimodal": 82 },
  { metric: "Cost Efficiency", "Sea Cape": 85, "Rail+Truck": 60, "Air Express": 15, "AI Multimodal": 55 },
  { metric: "Reliability", "Sea Cape": 78, "Rail+Truck": 85, "Air Express": 95, "AI Multimodal": 92 },
  { metric: "Capacity", "Sea Cape": 95, "Rail+Truck": 70, "Air Express": 20, "AI Multimodal": 75 },
  { metric: "Risk Reduction", "Sea Cape": 65, "Rail+Truck": 88, "Air Express": 95, "AI Multimodal": 93 },
  { metric: "Sustainability", "Sea Cape": 55, "Rail+Truck": 82, "Air Express": 10, "AI Multimodal": 58 },
];

const SuezRoutingDrilldown = ({ alert, onBack }: SuezRoutingDrilldownProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [agentActive, setAgentActive] = useState(true);
  const [signalRefreshCount, setSignalRefreshCount] = useState(0);

  // Simulate live signal refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalRefreshCount(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSignalStatusColor = (status: string) => {
    switch (status) {
      case "blocked": return "bg-critical text-critical-foreground";
      case "congested": return "bg-high text-high-foreground";
      case "minor-delay": return "bg-medium text-medium-foreground";
      case "clear": case "active": return "bg-success text-success-foreground";
      default: return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "HIGH": return "bg-critical/10 text-critical border-critical/20";
      case "MEDIUM": return "bg-medium/10 text-medium border-medium/20";
      case "LOW": return "bg-success/10 text-success border-success/20";
      default: return "";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "road": return <Truck className="h-3.5 w-3.5" />;
      case "rail": return <Train className="h-3.5 w-3.5" />;
      case "sea": return <Ship className="h-3.5 w-3.5" />;
      case "air": return <Plane className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{alert.icon}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{alert.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-high text-high-foreground">{alert.severity}</Badge>
              <span className="text-muted-foreground">{alert.region}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-medium">{alert.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${agentActive ? "bg-success animate-pulse" : "bg-muted"}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {agentActive ? "AI Agents Active" : "Agents Paused"}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="signals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signals">Real-Time Signals</TabsTrigger>
          <TabsTrigger value="strategies">Transport Strategies</TabsTrigger>
          <TabsTrigger value="simulation">ROI & Simulation</TabsTrigger>
          <TabsTrigger value="ai-agents">AI Agent Insights</TabsTrigger>
        </TabsList>

        {/* ═══════ REAL-TIME SIGNALS ═══════ */}
        <TabsContent value="signals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Signal Dashboard
            </h2>
            <Button variant="outline" size="sm" onClick={() => setSignalRefreshCount(prev => prev + 1)}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh Signals
            </Button>
          </div>

          {/* Traffic Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Live Traffic & Route Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {LIVE_SIGNALS.traffic.map((route, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getModeIcon(route.mode)}
                      <div>
                        <p className="font-medium text-sm text-foreground">{route.corridor}</p>
                        <p className="text-xs text-muted-foreground capitalize">{route.mode} transport</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {route.delay > 0 && (
                        <span className="text-xs text-muted-foreground">+{route.delay}h delay</span>
                      )}
                      <Badge className={getSignalStatusColor(route.status)}>
                        {route.status === "clear" ? "✓ Clear" : route.status === "active" ? "✓ Active" : route.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather + Vehicle Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather Disruptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5" />
                  Weather Disruptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LIVE_SIGNALS.weather.map((w, idx) => {
                    const Icon = w.icon;
                    return (
                      <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{w.region}</span>
                          </div>
                          <Badge variant="outline" className={getSeverityBadge(w.severity)}>{w.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{w.condition} – {w.impact}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Vehicle & Asset Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LIVE_SIGNALS.vehicleAvailability.map((v, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{v.type}</span>
                        <span className="text-muted-foreground">{v.available}/{v.total} available</span>
                      </div>
                      <Progress value={100 - v.utilization} className="h-2" />
                      <p className="text-xs text-muted-foreground">{v.utilization}% utilized</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transport Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Transportation Capacity by Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {LIVE_SIGNALS.transportCapacity.map((tc, idx) => (
                  <div key={idx} className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-3xl font-bold text-foreground mb-1">{tc.capacity}%</div>
                    <p className="text-sm font-medium text-foreground">{tc.mode}</p>
                    <div className={`text-xs mt-1 font-medium ${tc.weeklyChange > 0 ? "text-success" : tc.weeklyChange < 0 ? "text-critical" : "text-muted-foreground"}`}>
                      {tc.weeklyChange > 0 ? "↑" : tc.weeklyChange < 0 ? "↓" : "→"} {Math.abs(tc.weeklyChange)}% this week
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{tc.trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ TRANSPORT STRATEGIES ═══════ */}
        <TabsContent value="strategies" className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Multimodal Transport Strategies
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TRANSPORT_STRATEGIES.map((strategy) => (
              <Card
                key={strategy.id}
                className={`hover:shadow-lg transition-all cursor-pointer border-2 ${
                  selectedStrategy === strategy.id ? "border-primary shadow-md" : "border-transparent"
                } ${strategy.id === "multimodal-split" ? "ring-2 ring-primary/20" : ""}`}
                onClick={() => setSelectedStrategy(strategy.id === selectedStrategy ? null : strategy.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {strategy.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        <p className="text-lg mt-0.5">{strategy.modeEmoji}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {strategy.id === "multimodal-split" && (
                        <Badge className="bg-primary text-primary-foreground text-xs">AI Recommended</Badge>
                      )}
                      <Badge variant="outline" className={
                        strategy.feasibility === "HIGH" ? "border-success text-success" : "border-medium text-medium"
                      }>
                        {strategy.feasibility} Feasibility
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="text-xs text-muted-foreground block">Transit Time</span>
                      <span className="font-semibold">{strategy.transitTime}</span>
                      <span className="text-xs text-muted-foreground block">was {strategy.originalTransit}</span>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="text-xs text-muted-foreground block">Cost (quarterly)</span>
                      <span className="font-semibold">€{strategy.cost}M</span>
                      <span className="text-xs text-critical block">{strategy.costVsOriginal}</span>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="text-xs text-muted-foreground block">Reliability</span>
                      <span className="font-semibold">{strategy.reliability}%</span>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="text-xs text-muted-foreground block">AI Confidence</span>
                      <span className="font-semibold text-primary">{strategy.aiConfidence}%</span>
                    </div>
                  </div>

                  {/* Route */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Route:</span>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {strategy.route.map((stop, i) => (
                        <span key={i} className="text-xs">
                          {i > 0 && <span className="text-muted-foreground mx-1">→</span>}
                          <span className="bg-muted/50 px-1.5 py-0.5 rounded text-foreground">{stop}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Real-Time Factors */}
                  <div>
                    <span className="text-xs font-medium text-primary flex items-center gap-1 mb-1">
                      <Zap className="h-3 w-3" /> Live Signal Factors
                    </span>
                    <ul className="space-y-1">
                      {strategy.realTimeFactors.map((factor, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <Activity className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros/Cons */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-medium text-success">Pros:</span>
                      <ul className="text-xs text-muted-foreground space-y-0.5 mt-0.5">
                        {strategy.pros.map((p, i) => <li key={i} className="flex items-start gap-1"><CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-critical">Cons:</span>
                      <ul className="text-xs text-muted-foreground space-y-0.5 mt-0.5">
                        {strategy.cons.map((c, i) => <li key={i} className="flex items-start gap-1"><AlertTriangle className="h-3 w-3 text-critical mt-0.5 flex-shrink-0" />{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* CO2 & Capacity footer */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>{strategy.co2Impact}</span>
                    <span>{strategy.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════ ROI & SIMULATION ═══════ */}
        <TabsContent value="simulation" className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-critical/20 bg-critical/5">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-7 w-7 text-critical mx-auto mb-2" />
                <div className="text-2xl font-bold text-critical">€2.4M</div>
                <div className="text-xs text-muted-foreground">Quarterly Cost Impact</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-7 w-7 text-high mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">+12 days</div>
                <div className="text-xs text-muted-foreground">Added Transit (Sea)</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 text-center">
                <Brain className="h-7 w-7 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">97%</div>
                <div className="text-xs text-muted-foreground">AI Confidence (Multimodal)</div>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-success/5">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-7 w-7 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">93%</div>
                <div className="text-xs text-muted-foreground">Best Risk Reduction</div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Comparison Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Cost vs. Revenue Protection by Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ROI_DATA} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "€M", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value: number) => [`€${value}M`]} />
                  <Legend />
                  <Bar dataKey="cost" name="Quarterly Cost (€M)" fill="hsl(var(--critical))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenueProtected" name="Revenue Protected (€M)" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar + Cost/Day */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Dimensional Strategy Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={RADAR_STRATEGIES}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Sea Cape" dataKey="Sea Cape" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.15} />
                    <Radar name="Rail+Truck" dataKey="Rail+Truck" stroke="hsl(152, 69%, 36%)" fill="hsl(152, 69%, 36%)" fillOpacity={0.15} />
                    <Radar name="Air Express" dataKey="Air Express" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.15} />
                    <Radar name="AI Multimodal" dataKey="AI Multimodal" stroke="hsl(207, 90%, 40%)" fill="hsl(207, 90%, 40%)" fillOpacity={0.3} strokeWidth={2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Day Saved vs. Transit Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={COST_PER_DAY_SAVED.filter(d => d.daysReduced > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" label={{ value: "€M/day", angle: -90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "Days", angle: 90, position: "insideRight" }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="costPerDay" name="Cost/Day Saved (€M)" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="daysReduced" name="Days Reduced" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Full Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-3 font-medium">Strategy</th>
                      <th className="text-right py-3 px-3 font-medium">Transit</th>
                      <th className="text-right py-3 px-3 font-medium">Cost/Qtr</th>
                      <th className="text-right py-3 px-3 font-medium">vs. Original</th>
                      <th className="text-right py-3 px-3 font-medium">Reliability</th>
                      <th className="text-right py-3 px-3 font-medium">Risk Red.</th>
                      <th className="text-right py-3 px-3 font-medium">CO₂</th>
                      <th className="text-center py-3 px-3 font-medium">AI Pick</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSPORT_STRATEGIES.map((s) => (
                      <tr key={s.id} className={`border-b hover:bg-muted/20 ${s.id === "multimodal-split" ? "bg-primary/5" : ""}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span>{s.modeEmoji}</span>
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-muted-foreground">{s.modes.join(" + ")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-3">{s.transitTime}</td>
                        <td className="text-right py-3 px-3 font-medium">€{s.cost}M</td>
                        <td className="text-right py-3 px-3 text-critical">{s.costVsOriginal}</td>
                        <td className="text-right py-3 px-3">{s.reliability}%</td>
                        <td className="text-right py-3 px-3">{s.riskReduction}%</td>
                        <td className="text-right py-3 px-3 text-xs">{s.co2Impact}</td>
                        <td className="text-center py-3 px-3">
                          {s.id === "multimodal-split" && (
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
        </TabsContent>

        {/* ═══════ AI AGENT INSIGHTS ═══════ */}
        <TabsContent value="ai-agents" className="space-y-6">
          {/* AI Recommendation */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Agentic AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">AI-Optimized Multimodal Split</span>
                  <span className="text-lg">🧠🚆✈️🚚</span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">97% Confidence</Badge>
              </div>
              <p className="text-muted-foreground">
                Based on analysis of 847 real-time signals across 4 transport modes, the AI agent recommends a dynamic multimodal split:
                <strong> 15% air freight</strong> for critical MRI/CT components (3-5 day delivery),
                <strong> 65% rail</strong> for bulk medical supplies via China-Europe Express (18-22 days), and
                <strong> 20% road</strong> for intra-EU distribution. The system continuously re-optimizes every 4 hours.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background p-3 rounded-lg text-center">
                  <Plane className="h-5 w-5 mx-auto mb-1 text-critical" />
                  <div className="text-lg font-bold">15%</div>
                  <div className="text-xs text-muted-foreground">Air (Critical)</div>
                  <div className="text-xs text-foreground font-medium">MRI components</div>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <Train className="h-5 w-5 mx-auto mb-1 text-success" />
                  <div className="text-lg font-bold">65%</div>
                  <div className="text-xs text-muted-foreground">Rail (Bulk)</div>
                  <div className="text-xs text-foreground font-medium">Medical supplies</div>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">20%</div>
                  <div className="text-xs text-muted-foreground">Road (Distribution)</div>
                  <div className="text-xs text-foreground font-medium">EU last-mile</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost of Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost of Implementation & ROI – AI Multimodal Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Cost Breakdown (Quarterly)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Air freight (critical)</span><span className="font-medium">€1.23M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Rail freight (bulk)</span><span className="font-medium">€1.56M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Road distribution</span><span className="font-medium">€0.92M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">AI platform & signals</span><span className="font-medium">€0.35M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Coordination overhead</span><span className="font-medium">€0.28M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Insurance differential</span><span className="font-medium">€0.26M</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold"><span>Total</span><span>€4.60M</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">vs. original Suez route</span><span className="text-critical font-medium">+€2.20M (+92%)</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Revenue & Risk Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Revenue at risk (delay)</span><span className="font-medium text-critical">€2.4M/qtr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Revenue protected (96%)</span><span className="font-medium text-success">€2.30M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Customer retention value</span><span className="font-medium">€3.8M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Penalty avoidance</span><span className="font-medium">€0.9M</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">Total value protected</span><span className="font-bold text-success">€7.0M</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Net ROI</span><span className="font-bold text-primary">+52%</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Key Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg. transit time</span><span className="font-medium">12 days (vs 40)</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time saved</span><span className="font-medium text-success">28 days</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Risk reduction</span><span className="font-medium">93%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Reliability score</span><span className="font-medium">92%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Re-optimization freq.</span><span className="font-medium">Every 4h</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Data points analyzed</span><span className="font-medium">847 signals</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Decision Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Agent Decision Log (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {AGENT_DECISIONS.map((decision, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-muted/20 rounded-lg">
                    <div className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5">{decision.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="outline" className="text-xs">{decision.agent}</Badge>
                        <Badge className={getSeverityBadge(decision.priority)} variant="outline">{decision.priority}</Badge>
                      </div>
                      <p className="text-sm text-foreground">{decision.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Signal: {decision.signal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario: Port Delay Auto-Switch */}
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Live Scenario: Port Delay Auto-Switch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  🚨 Scenario Triggered: Piraeus Port Congestion Detected
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Mediterranean storm caused 18h backlog at Piraeus. AI agent automatically re-routed 3 container loads of IntelliVue monitors.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-critical/20 p-3 rounded-lg">
                    <p className="text-xs font-medium text-critical mb-1">❌ Original Route (Cancelled)</p>
                    <p className="text-sm text-muted-foreground">
                      Singapore → Suez → Piraeus → Truck → Eindhoven
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">ETA: Delayed indefinitely</p>
                  </div>
                  <div className="border border-success/20 p-3 rounded-lg">
                    <p className="text-xs font-medium text-success mb-1">✅ AI-Switched Route (Active)</p>
                    <p className="text-sm text-muted-foreground">
                      Singapore → Shenzhen → 🚆 Rail to Duisburg → 🚚 Truck to Eindhoven
                    </p>
                    <p className="text-xs text-success mt-1">ETA: 19 days (saved ~23 days vs. waiting)</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  Auto-switch executed at 09:38 UTC • Cost delta: +€0.12M • 340 rail containers confirmed available
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuezRoutingDrilldown;
