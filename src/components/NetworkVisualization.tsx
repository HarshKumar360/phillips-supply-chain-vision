import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Factory, Package, Truck, Store, MapPin, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: "supplier" | "manufacturer" | "distribution" | "retailer";
  location: string;
  status: "operational" | "warning" | "critical";
  products: string[];
  capacity: string;
  utilization: number;
  throughput: string;
  details: {
    address: string;
    established: string;
    employees: number;
    certifications: string[];
    keyMetrics: { label: string; value: string }[];
  };
}

const networkData: NetworkNode[] = [
  // Suppliers
  {
    id: "s1",
    name: "TSMC Semiconductor Supply",
    type: "supplier",
    location: "Taiwan",
    status: "critical",
    products: ["Medical-Grade Chips", "ASIC Processors"],
    capacity: "50,000 wafers/month",
    utilization: 98,
    throughput: "49,000 wafers/month",
    details: {
      address: "Hsinchu Science Park, Taiwan",
      established: "1987",
      employees: 65000,
      certifications: ["ISO 9001", "IATF 16949", "ISO 14001"],
      keyMetrics: [
        { label: "Quality Score", value: "99.2%" },
        { label: "On-Time Delivery", value: "87%" },
        { label: "Defect Rate", value: "0.02 DPPM" },
      ],
    },
  },
  {
    id: "s2",
    name: "Siemens Healthineers Components",
    type: "supplier",
    location: "Germany",
    status: "warning",
    products: ["X-Ray Tubes", "Detector Arrays", "Gradient Coils"],
    capacity: "12,000 units/year",
    utilization: 89,
    throughput: "10,680 units/year",
    details: {
      address: "Erlangen, Germany",
      established: "2001",
      employees: 3200,
      certifications: ["ISO 13485", "CE Marking", "FDA 21 CFR Part 820"],
      keyMetrics: [
        { label: "Quality Score", value: "97%" },
        { label: "On-Time Delivery", value: "91%" },
        { label: "Sustainability Rating", value: "A+" },
      ],
    },
  },
  {
    id: "s3",
    name: "Lynas Rare Earths Ltd",
    type: "supplier",
    location: "Australia",
    status: "operational",
    products: ["Neodymium", "Helium-3", "Rare Earth Magnets"],
    capacity: "10,500 MT/year",
    utilization: 76,
    throughput: "7,980 MT/year",
    details: {
      address: "Mount Weld, Western Australia",
      established: "2011",
      employees: 850,
      certifications: ["ISO 14001", "ISO 45001", "Responsible Minerals Initiative"],
      keyMetrics: [
        { label: "Quality Score", value: "95%" },
        { label: "On-Time Delivery", value: "93%" },
        { label: "Sustainability Rating", value: "A" },
      ],
    },
  },
  {
    id: "s4",
    name: "Corning Specialty Glass",
    type: "supplier",
    location: "United States",
    status: "operational",
    products: ["Display Glass", "Optical Fibers", "Ceramic Substrates"],
    capacity: "85,000 units/year",
    utilization: 82,
    throughput: "69,700 units/year",
    details: {
      address: "Corning, New York",
      established: "1851",
      employees: 4500,
      certifications: ["ISO 9001", "ISO 13485", "ITAR Registered"],
      keyMetrics: [
        { label: "Quality Score", value: "98.5%" },
        { label: "On-Time Delivery", value: "96%" },
        { label: "Sustainability Rating", value: "A" },
      ],
    },
  },
  // Manufacturers
  {
    id: "m1",
    name: "Philips MRI Systems Factory",
    type: "manufacturer",
    location: "Netherlands",
    status: "warning",
    products: ["Ingenia Ambition", "Ingenia Elition", "MR 5300"],
    capacity: "320 systems/year",
    utilization: 72,
    throughput: "230 systems/year",
    details: {
      address: "Best, Netherlands",
      established: "1985",
      employees: 4200,
      certifications: ["ISO 13485", "FDA 510(k)", "CE MDR", "MDSAP"],
      keyMetrics: [
        { label: "OEE", value: "76%" },
        { label: "First Pass Yield", value: "92%" },
        { label: "Safety Record", value: "520 days incident-free" },
      ],
    },
  },
  {
    id: "m2",
    name: "Philips Ultrasound Manufacturing",
    type: "manufacturer",
    location: "United States",
    status: "operational",
    products: ["EPIQ Elite", "Affiniti", "Lumify"],
    capacity: "8,500 systems/year",
    utilization: 88,
    throughput: "7,480 systems/year",
    details: {
      address: "Bothell, Washington",
      established: "1998",
      employees: 2800,
      certifications: ["ISO 13485", "FDA QSR", "CE MDR"],
      keyMetrics: [
        { label: "OEE", value: "84%" },
        { label: "First Pass Yield", value: "95%" },
        { label: "Safety Record", value: "680 days incident-free" },
      ],
    },
  },
  {
    id: "m3",
    name: "Philips Patient Monitoring Plant",
    type: "manufacturer",
    location: "Germany",
    status: "operational",
    products: ["IntelliVue MX800", "IntelliVue X3", "Patient Monitors"],
    capacity: "45,000 units/year",
    utilization: 91,
    throughput: "40,950 units/year",
    details: {
      address: "Böblingen, Germany",
      established: "1992",
      employees: 1850,
      certifications: ["ISO 13485", "IEC 60601", "CE MDR"],
      keyMetrics: [
        { label: "OEE", value: "87%" },
        { label: "First Pass Yield", value: "96%" },
        { label: "Safety Record", value: "410 days incident-free" },
      ],
    },
  },
  {
    id: "m4",
    name: "Philips Personal Health Factory",
    type: "manufacturer",
    location: "China",
    status: "operational",
    products: ["Sonicare", "OneBlade", "Airfryer"],
    capacity: "15M units/year",
    utilization: 85,
    throughput: "12.75M units/year",
    details: {
      address: "Zhuhai, Guangdong",
      established: "2004",
      employees: 6500,
      certifications: ["ISO 9001", "ISO 14001", "SA8000"],
      keyMetrics: [
        { label: "OEE", value: "89%" },
        { label: "First Pass Yield", value: "97%" },
        { label: "Safety Record", value: "340 days incident-free" },
      ],
    },
  },
  // Distribution Centers
  {
    id: "d1",
    name: "European Medical Hub",
    type: "distribution",
    location: "Netherlands",
    status: "operational",
    products: ["All Medical Devices"],
    capacity: "320,000 pallets/year",
    utilization: 84,
    throughput: "268,800 pallets/year",
    details: {
      address: "Eindhoven, Netherlands",
      established: "2012",
      employees: 520,
      certifications: ["GDP Certified", "ISO 13485", "AEO"],
      keyMetrics: [
        { label: "Order Accuracy", value: "99.6%" },
        { label: "On-Time Shipment", value: "97%" },
        { label: "Inventory Turns", value: "14x/year" },
      ],
    },
  },
  {
    id: "d2",
    name: "North America Healthcare DC",
    type: "distribution",
    location: "United States",
    status: "operational",
    products: ["MRI", "CT", "Ultrasound", "Monitors"],
    capacity: "450,000 pallets/year",
    utilization: 87,
    throughput: "391,500 pallets/year",
    details: {
      address: "Nashville, Tennessee",
      established: "2009",
      employees: 480,
      certifications: ["FDA Registered", "ISO 13485", "C-TPAT"],
      keyMetrics: [
        { label: "Order Accuracy", value: "99.4%" },
        { label: "On-Time Shipment", value: "96%" },
        { label: "Inventory Turns", value: "12x/year" },
      ],
    },
  },
  {
    id: "d3",
    name: "APAC Distribution Center",
    type: "distribution",
    location: "Singapore",
    status: "operational",
    products: ["Personal Health", "Medical Devices"],
    capacity: "280,000 pallets/year",
    utilization: 79,
    throughput: "221,200 pallets/year",
    details: {
      address: "Tuas, Singapore",
      established: "2016",
      employees: 310,
      certifications: ["GDP Certified", "ISO 13485", "HACCP"],
      keyMetrics: [
        { label: "Order Accuracy", value: "99.1%" },
        { label: "On-Time Shipment", value: "94%" },
        { label: "Inventory Turns", value: "16x/year" },
      ],
    },
  },
  // Retailers / Hospital Networks
  {
    id: "r1",
    name: "HCA Healthcare",
    type: "retailer",
    location: "United States",
    status: "operational",
    products: ["All Philips Healthcare Products"],
    capacity: "186 hospitals",
    utilization: 94,
    throughput: "175 hospitals active",
    details: {
      address: "Nationwide, USA",
      established: "Partnership since 2010",
      employees: 0,
      certifications: ["GPO Preferred Vendor"],
      keyMetrics: [
        { label: "Annual Contract Value", value: "$120M" },
        { label: "Equipment Uptime", value: "99.2%" },
        { label: "NPS Score", value: "72" },
      ],
    },
  },
  {
    id: "r2",
    name: "NHS England",
    type: "retailer",
    location: "United Kingdom",
    status: "operational",
    products: ["MRI Systems", "CT Scanners", "Patient Monitors"],
    capacity: "230 trusts",
    utilization: 91,
    throughput: "209 trusts active",
    details: {
      address: "Nationwide, UK",
      established: "Partnership since 2005",
      employees: 0,
      certifications: ["NHS Approved Supplier"],
      keyMetrics: [
        { label: "Annual Contract Value", value: "£85M" },
        { label: "Equipment Uptime", value: "98.8%" },
        { label: "NPS Score", value: "68" },
      ],
    },
  },
  {
    id: "r3",
    name: "Apollo Hospitals Group",
    type: "retailer",
    location: "India",
    status: "operational",
    products: ["Ultrasound", "CT", "Patient Monitoring"],
    capacity: "73 hospitals",
    utilization: 88,
    throughput: "64 hospitals active",
    details: {
      address: "Pan-India",
      established: "Partnership since 2012",
      employees: 0,
      certifications: ["Strategic Partner"],
      keyMetrics: [
        { label: "Annual Contract Value", value: "₹450Cr" },
        { label: "Equipment Uptime", value: "97.5%" },
        { label: "NPS Score", value: "74" },
      ],
    },
  },
];

const NetworkVisualization = () => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "critical":
        return "bg-critical text-critical-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "supplier":
        return <Package className="h-5 w-5" />;
      case "manufacturer":
        return <Factory className="h-5 w-5" />;
      case "distribution":
        return <Truck className="h-5 w-5" />;
      case "retailer":
        return <Store className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const filteredData = filterType === "all" 
    ? networkData 
    : networkData.filter(node => node.type === filterType);

  const kpis = [
    { label: "Total Network Nodes", value: "15", trend: "+3 YoY" },
    { label: "Avg Network Utilization", value: "86%", trend: "+4% MoM" },
    { label: "Operational Nodes", value: "13/15", trend: "87%" },
    { label: "Critical Issues", value: "1", trend: "-1 vs last month" },
  ];

  const filterButtons = [
    { key: "all", label: "All Nodes" },
    { key: "supplier", label: "Suppliers" },
    { key: "manufacturer", label: "Manufacturing" },
    { key: "distribution", label: "Distribution" },
    { key: "retailer", label: "Healthcare Partners" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Philips Supply Chain Network</h2>
        <div className="flex gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilterType(btn.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === btn.key 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {kpi.trend}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Nodes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Supply Chain Network Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredData.map((node) => (
                    <Card
                      key={node.id}
                      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                      onClick={() => setSelectedNode(node)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(node.type)}
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{node.name}</h4>
                              <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(node.status)} flex items-center gap-1`}>
                            {getStatusIcon(node.status)}
                            {node.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {node.location}
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Capacity: {node.capacity}</p>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  node.utilization >= 90
                                    ? "bg-critical"
                                    : node.utilization >= 75
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                                style={{ width: `${node.utilization}%` }}
                              />
                            </div>
                            <p className="text-muted-foreground mt-1">Utilization: {node.utilization}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Node Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {getTypeIcon(selectedNode.type)}
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{selectedNode.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{selectedNode.type}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(selectedNode.status)} mb-4`}>
                        {selectedNode.status}
                      </Badge>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium text-foreground">{selectedNode.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium text-foreground">{selectedNode.details.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Established</p>
                        <p className="text-sm font-medium text-foreground">{selectedNode.details.established}</p>
                      </div>
                      {selectedNode.details.employees > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground">Employees</p>
                          <p className="text-sm font-medium text-foreground">{selectedNode.details.employees.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Products/Services</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.products.map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-3">Capacity & Utilization</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Capacity</p>
                          <p className="text-sm font-medium text-foreground">{selectedNode.capacity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Current Throughput</p>
                          <p className="text-sm font-medium text-foreground">{selectedNode.throughput}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Utilization Rate</p>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                selectedNode.utilization >= 90
                                  ? "bg-critical"
                                  : selectedNode.utilization >= 75
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                              style={{ width: `${selectedNode.utilization}%` }}
                            />
                          </div>
                          <p className="text-sm font-medium text-foreground mt-1">{selectedNode.utilization}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.details.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-3">Key Performance Metrics</p>
                      <div className="space-y-3">
                        {selectedNode.details.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">{metric.label}</p>
                            <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Click on any network node to view detailed information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualization;
