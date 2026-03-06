import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  Brain, 
  ChevronLeft,
  CheckCircle,
  ArrowRight
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
      const remainingLoss = baseRevenueLoss - protectedRevenue;
      const roi = ((protectedRevenue - strategy.cost) / strategy.cost) * 100;

      return {
        strategyId,
        strategyName: strategy.name,
        protectedRevenue,
        remainingLoss,
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
      'Net Benefit': result.netBenefit,
      'Total Cost': result.totalCost,
      'Protected Revenue': result.protectedRevenue,
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
          case 'Risk Reduction':
            dataPoint[shortName] = result.riskReduction;
            break;
          case 'Revenue Protection':
            dataPoint[shortName] = result.revenueProtection;
            break;
          case 'Success Probability':
            dataPoint[shortName] = result.successProbability;
            break;
          case 'Cost Efficiency':
            dataPoint[shortName] = Math.min(100, (result.netBenefit / result.totalCost) * 20);
            break;
          case 'Speed':
            const weeks = parseInt(result.implementationTimeline.split('-')[0]);
            dataPoint[shortName] = Math.max(0, 100 - (weeks * 12));
            break;
        }
      });
      
      return dataPoint;
    });
  }, [simulationResults]);

  const comparisonData = useMemo(() => {
    return simulationResults.map(result => ({
      strategy: result.strategyName.split(' ').slice(0, 2).join(' '),
      roi: result.roi,
    }));
  }, [simulationResults]);

  const getSeverityColor = () => {
    switch (alert.severity) {
      case "CRITICAL": return "text-critical";
      case "HIGH": return "text-high";
      case "MEDIUM": return "text-medium";
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
              <Badge className={`bg-${alert.severity.toLowerCase()} text-${alert.severity.toLowerCase()}-foreground`}>
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

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Alert Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{alert.description}</p>
                <Separator />
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium text-foreground mb-2">Business Impact</h4>
                  <p className="text-sm text-muted-foreground">{alert.impact}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue at Risk</span>
                  <span className="font-bold text-critical">€18M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time to Impact</span>
                  <span className="font-medium text-foreground">8 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Affected Products</span>
                  <span className="font-medium text-foreground">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Supply Risk</span>
                  <span className={`font-bold ${getSeverityColor()}`}>Critical</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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
                        {strategy.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-critical">Cons:</span>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {strategy.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={strategy.id}
                      checked={selectedStrategies.includes(strategy.id)}
                      onCheckedChange={() => toggleStrategy(strategy.id)}
                    />
                    <label
                      htmlFor={strategy.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">
                      €{Math.max(...simulationResults.map(r => r.protectedRevenue)).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Best Revenue Protection</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.max(...simulationResults.map(r => r.roi)).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Highest ROI</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      €{Math.max(...simulationResults.map(r => r.netBenefit)).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Best Net Benefit</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>ROI Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" />
                      <YAxis label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="roi" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Amount (€M)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Protected Revenue" fill="hsl(var(--success))" />
                      <Bar dataKey="Total Cost" fill="hsl(var(--critical))" />
                      <Bar dataKey="Net Benefit" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multi-Dimensional Strategy Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {simulationResults.map((result, index) => {
                        const colors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--high))'];
                        return (
                          <Radar
                            key={result.strategyId}
                            name={result.strategyName.split(' ')[0]}
                            dataKey={result.strategyName.split(' ')[0]}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.3}
                          />
                        );
                      })}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

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
                          <th className="text-right py-3 px-2 font-medium">Protected Revenue</th>
                          <th className="text-right py-3 px-2 font-medium">Net Benefit</th>
                          <th className="text-right py-3 px-2 font-medium">ROI</th>
                          <th className="text-right py-3 px-2 font-medium">Timeline</th>
                          <th className="text-right py-3 px-2 font-medium">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationResults.map((result) => (
                          <tr key={result.strategyId} className="border-b">
                            <td className="py-3 px-2 font-medium">{result.strategyName}</td>
                            <td className="text-right py-3 px-2">€{result.totalCost}M</td>
                            <td className="text-right py-3 px-2 text-success">€{result.protectedRevenue.toFixed(1)}M</td>
                            <td className="text-right py-3 px-2 font-medium text-primary">€{result.netBenefit.toFixed(1)}M</td>
                            <td className="text-right py-3 px-2 font-bold text-success">{result.roi.toFixed(0)}%</td>
                            <td className="text-right py-3 px-2">{result.implementationTimeline}</td>
                            <td className="text-right py-3 px-2">{result.successProbability}%</td>
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

        <TabsContent value="ai-insights" className="space-y-6">
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
                  {strategyOptions.find(s => s.id === aiRecommendation.strategy)?.name}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">€15.8M</div>
                <div className="text-sm text-muted-foreground">Revenue Protected</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">4-6 weeks</div>
                <div className="text-sm text-muted-foreground">Implementation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">251%</div>
                <div className="text-sm text-muted-foreground">Expected ROI</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertDrilldown;
