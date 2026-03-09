export interface StrategyOption {
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

export interface AiRecommendation {
  strategy: string;
  confidence: number;
  reasoning: string;
  keyFactors: string[];
}

export interface AffectedProduct {
  name: string;
  units: number;
  revenue: string;
  status: "delayed" | "at-risk" | "monitoring";
}

export interface TimelineEvent {
  date: string;
  event: string;
  type: "trigger" | "action" | "current" | "risk" | "milestone";
}

export interface SupplierRisk {
  name: string;
  share: number;
  risk: "Critical" | "Medium" | "Low";
}

export interface RegionImpact {
  region: string;
  revenue: number;
  systems: number;
  percentage: number;
}

export interface WeeklyTrend {
  week: string;
  riskScore: number;
  inventoryWeeks: number;
  deliveryDelay: number;
}

export interface RootCause {
  label: string;
  description: string;
}

export interface AlertContextData {
  revenueAtRisk: number;
  timeToImpact: string;
  stockoutDate: string;
  safetyStockWeeks: number;
  depletionRate: string;
  riskScore: number;
  riskDelta: string;
  strategyOptions: StrategyOption[];
  aiRecommendation: AiRecommendation;
  affectedProducts: AffectedProduct[];
  timelineEvents: TimelineEvent[];
  supplierRiskData: SupplierRisk[];
  impactByRegion: RegionImpact[];
  weeklyTrendData: WeeklyTrend[];
  rootCauses: RootCause[];
  costBreakdown: { label: string; amount: string }[];
}

// ─── SEMICONDUCTOR SHORTAGE ───
const semiconductorData: AlertContextData = {
  revenueAtRisk: 18,
  timeToImpact: "8 weeks",
  stockoutDate: "Apr 15",
  safetyStockWeeks: 14,
  depletionRate: "1.5 weeks/week",
  riskScore: 8.2,
  riskDelta: "↑ 4.0 from 4 weeks ago",
  strategyOptions: [
    {
      id: "alternative-sourcing",
      name: "Alternative Chip Sourcing",
      description: "Qualify Samsung Foundry and GlobalFoundries for medical-grade ASICs currently sole-sourced from TSMC",
      cost: 4.5,
      timeline: "4-6 weeks",
      riskReduction: 82,
      revenueProtection: 88,
      feasibility: "HIGH",
      pros: ["Diversified fab capacity", "Samsung pre-qualification underway", "Long-term resilience against Taiwan risk"],
      cons: ["Higher unit costs (+8%)", "FDA/CE re-qualification cycle", "Different process node adaptation"]
    },
    {
      id: "inventory-buffer",
      name: "Strategic Chip Safety Stock",
      description: "Increase safety stock of medical-grade ASICs and custom ICs from 14 to 28 weeks",
      cost: 3.2,
      timeline: "1-2 weeks",
      riskReduction: 72,
      revenueProtection: 85,
      feasibility: "HIGH",
      pros: ["Immediate protection", "No design changes needed", "Bridges to alt-source qualification"],
      cons: ["€3.2M capital tied up", "Chip obsolescence risk", "Warehouse capacity constraints"]
    },
    {
      id: "design-consolidation",
      name: "Chip Consolidation Redesign",
      description: "Consolidate 5 custom ASICs into 2 multi-function chips, reducing unique part numbers by 30%",
      cost: 2.8,
      timeline: "12-16 weeks",
      riskReduction: 68,
      revenueProtection: 78,
      feasibility: "MEDIUM",
      pros: ["Long-term cost reduction", "Fewer unique parts to source", "Simplified BOM"],
      cons: ["Long development cycle", "Re-certification required", "Engineering resource intensive"]
    },
    {
      id: "product-prioritization",
      name: "Product Line Prioritization",
      description: "Allocate remaining chip inventory to life-critical and highest-margin MRI/CT systems first",
      cost: 0.5,
      timeline: "1 week",
      riskReduction: 35,
      revenueProtection: 55,
      feasibility: "HIGH",
      pros: ["Zero capital required", "Protects critical care lines", "Immediate execution"],
      cons: ["Delays lower-priority products", "Customer relationship risk on deprioritized lines"]
    }
  ],
  aiRecommendation: {
    strategy: "alternative-sourcing",
    confidence: 89,
    reasoning: "Given the critical severity and €18M revenue impact on MRI/CT production, alternative chip sourcing provides the best long-term risk reduction (82%) with strong revenue protection (88%). Samsung Foundry pre-qualification is already underway, and regulatory fast-track can leverage existing FDA/CE documentation.",
    keyFactors: [
      "Critical impact on life-saving MRI and CT equipment",
      "65% chip dependency on single TSMC fab – extreme concentration risk",
      "Samsung Foundry pre-qualified for 65nm medical ASICs (Q3 target)",
      "FDA/CE documentation can be expedited via fast-track process"
    ]
  },
  affectedProducts: [
    { name: "Ingenia Ambition 1.5T", units: 8, revenue: "€4.8M", status: "delayed" },
    { name: "Ingenia Elition 3.0T", units: 6, revenue: "€7.2M", status: "at-risk" },
    { name: "MR 5300", units: 4, revenue: "€2.4M", status: "monitoring" },
    { name: "Incisive CT", units: 3, revenue: "€2.1M", status: "delayed" },
    { name: "IntelliVue MX800", units: 3, revenue: "€1.5M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Feb 15", event: "TSMC allocation cut announced", type: "trigger" },
    { date: "Feb 22", event: "Safety stock buffer activated", type: "action" },
    { date: "Mar 1", event: "Samsung Foundry qualification started", type: "action" },
    { date: "Mar 6", event: "Current date – 14-week buffer remaining", type: "current" },
    { date: "Apr 15", event: "Projected stockout if no action", type: "risk" },
    { date: "May 1", event: "Samsung qualification expected complete", type: "milestone" },
  ],
  supplierRiskData: [
    { name: "TSMC (Primary)", share: 65, risk: "Critical" },
    { name: "Samsung Foundry", share: 20, risk: "Low" },
    { name: "GlobalFoundries", share: 10, risk: "Medium" },
    { name: "Others", share: 5, risk: "Low" },
  ],
  impactByRegion: [
    { region: "Europe", revenue: 8.2, systems: 10, percentage: 45 },
    { region: "North America", revenue: 5.4, systems: 8, percentage: 30 },
    { region: "APAC", revenue: 3.2, systems: 4, percentage: 18 },
    { region: "LATAM", revenue: 1.2, systems: 2, percentage: 7 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 4.2, inventoryWeeks: 18, deliveryDelay: 0 },
    { week: "W2", riskScore: 5.1, inventoryWeeks: 16, deliveryDelay: 1 },
    { week: "W3", riskScore: 6.4, inventoryWeeks: 16, deliveryDelay: 2 },
    { week: "W4", riskScore: 7.8, inventoryWeeks: 14, deliveryDelay: 3 },
    { week: "W5 (Now)", riskScore: 8.2, inventoryWeeks: 14, deliveryDelay: 4 },
    { week: "W6 (Proj)", riskScore: 8.8, inventoryWeeks: 12, deliveryDelay: 6 },
    { week: "W7 (Proj)", riskScore: 9.1, inventoryWeeks: 10, deliveryDelay: 8 },
    { week: "W8 (Proj)", riskScore: 9.5, inventoryWeeks: 8, deliveryDelay: 10 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "Consumer electronics demand surge (+40% YoY) consuming medical-grade fab capacity" },
    { label: "Contributing Factor", description: "Geopolitical tensions increasing supply concentration risk in Taiwan" },
    { label: "Dependency Risk", description: "65% of medical-grade ASICs sourced from single fab (TSMC N7 process)" },
    { label: "Regulatory Impact", description: "Alternative suppliers require 8-12 week FDA/CE re-qualification cycle" },
  ],
  costBreakdown: [
    { label: "Supplier qualification", amount: "€1.8M" },
    { label: "Regulatory fast-track", amount: "€0.9M" },
    { label: "Logistics setup", amount: "€0.6M" },
    { label: "Quality validation", amount: "€0.8M" },
    { label: "Contingency (10%)", amount: "€0.4M" },
  ],
};

// ─── RARE EARTH PRICE SURGE ───
const rareEarthData: AlertContextData = {
  revenueAtRisk: 8.5,
  timeToImpact: "12 weeks",
  stockoutDate: "Jun 1",
  safetyStockWeeks: 10,
  depletionRate: "Market-driven price escalation",
  riskScore: 7.1,
  riskDelta: "↑ 2.3 from 4 weeks ago",
  strategyOptions: [
    {
      id: "hedging-contracts",
      name: "Commodity Price Hedging",
      description: "Lock in neodymium pricing through 18-month forward contracts with major rare earth suppliers",
      cost: 2.1,
      timeline: "2-3 weeks",
      riskReduction: 78,
      revenueProtection: 85,
      feasibility: "HIGH",
      pros: ["Price certainty for 18 months", "No supply chain changes", "Proven financial instrument"],
      cons: ["Upfront premium cost", "Locked if prices drop", "Counterparty risk"]
    },
    {
      id: "magnet-redesign",
      name: "Reduced Rare Earth Magnet Design",
      description: "Redesign MRI superconducting magnets to use 30% less neodymium through advanced grain boundary diffusion",
      cost: 5.2,
      timeline: "16-20 weeks",
      riskReduction: 72,
      revenueProtection: 82,
      feasibility: "MEDIUM",
      pros: ["Permanent cost reduction", "Less dependency on China exports", "Patent-protected IP"],
      cons: ["Long R&D cycle", "MRI performance validation required", "High upfront engineering cost"]
    },
    {
      id: "alternative-materials",
      name: "Ferrite Alternative Qualification",
      description: "Qualify ferrite-based permanent magnets for non-critical motor applications, reserving neodymium for MRI magnets only",
      cost: 1.4,
      timeline: "8-10 weeks",
      riskReduction: 55,
      revenueProtection: 68,
      feasibility: "HIGH",
      pros: ["Reduces neodymium consumption 40%", "Ferrite widely available", "Lower material cost"],
      cons: ["Performance trade-off in motors", "Only applies to non-MRI applications", "Testing cycle required"]
    },
    {
      id: "strategic-reserve",
      name: "Neodymium Strategic Reserve",
      description: "Purchase 6-month strategic reserve of neodymium oxide at current pricing before further export restrictions",
      cost: 3.8,
      timeline: "1-2 weeks",
      riskReduction: 65,
      revenueProtection: 78,
      feasibility: "HIGH",
      pros: ["Immediate price protection", "Simple execution", "Leverages current pricing"],
      cons: ["Significant capital outlay", "Storage & handling costs", "Price may decline"]
    }
  ],
  aiRecommendation: {
    strategy: "hedging-contracts",
    confidence: 86,
    reasoning: "With neodymium prices up 22% YoY and China export restrictions tightening, commodity hedging provides the fastest risk mitigation (2-3 weeks) with 78% risk reduction. The €2.1M premium is justified against €8.5M annual margin impact. Combine with ferrite qualification for long-term structural reduction.",
    keyFactors: [
      "China controls 90% of global rare earth processing",
      "MRI magnet costs already up €120K per unit",
      "Forward contracts available at +8% vs. spot (vs. projected +35%)",
      "Hedging protects margin while R&D alternatives mature"
    ]
  },
  affectedProducts: [
    { name: "Ingenia Ambition 1.5T", units: 12, revenue: "€3.6M", status: "at-risk" },
    { name: "Ingenia Elition 3.0T", units: 8, revenue: "€4.2M", status: "at-risk" },
    { name: "Sonicare DiamondClean (motors)", units: 50, revenue: "€0.4M", status: "monitoring" },
    { name: "Lumify Ultrasound (motors)", units: 15, revenue: "€0.3M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Jan 10", event: "China Ministry announces new export quotas", type: "trigger" },
    { date: "Jan 28", event: "Neodymium spot price crosses €300/kg threshold", type: "trigger" },
    { date: "Feb 12", event: "Procurement initiates hedging analysis", type: "action" },
    { date: "Mar 6", event: "Current date – prices at €320/kg", type: "current" },
    { date: "Apr 1", event: "New export restrictions take effect", type: "risk" },
    { date: "Jun 1", event: "Projected price peak €380/kg without hedging", type: "risk" },
  ],
  supplierRiskData: [
    { name: "China Northern Rare Earth", share: 55, risk: "Critical" },
    { name: "Lynas (Australia)", share: 25, risk: "Medium" },
    { name: "MP Materials (US)", share: 15, risk: "Low" },
    { name: "Others", share: 5, risk: "Low" },
  ],
  impactByRegion: [
    { region: "Europe", revenue: 4.2, systems: 12, percentage: 50 },
    { region: "North America", revenue: 2.5, systems: 8, percentage: 29 },
    { region: "APAC", revenue: 1.2, systems: 5, percentage: 14 },
    { region: "LATAM", revenue: 0.6, systems: 2, percentage: 7 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 3.8, inventoryWeeks: 14, deliveryDelay: 0 },
    { week: "W2", riskScore: 4.5, inventoryWeeks: 13, deliveryDelay: 0 },
    { week: "W3", riskScore: 5.2, inventoryWeeks: 12, deliveryDelay: 1 },
    { week: "W4", riskScore: 6.1, inventoryWeeks: 11, deliveryDelay: 1 },
    { week: "W5 (Now)", riskScore: 7.1, inventoryWeeks: 10, deliveryDelay: 2 },
    { week: "W6 (Proj)", riskScore: 7.8, inventoryWeeks: 9, deliveryDelay: 3 },
    { week: "W7 (Proj)", riskScore: 8.3, inventoryWeeks: 8, deliveryDelay: 4 },
    { week: "W8 (Proj)", riskScore: 8.9, inventoryWeeks: 6, deliveryDelay: 6 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "China export restrictions on rare earth elements reducing global neodymium supply by 18%" },
    { label: "Contributing Factor", description: "EV motor demand competing for same rare earth supply (+60% YoY)" },
    { label: "Dependency Risk", description: "90% of global rare earth processing concentrated in China" },
    { label: "Price Impact", description: "Neodymium price up 22% YoY, projected to reach +35% by Q2 2026" },
  ],
  costBreakdown: [
    { label: "Forward contract premiums", amount: "€0.9M" },
    { label: "Broker & trading fees", amount: "€0.3M" },
    { label: "Logistics for reserve storage", amount: "€0.4M" },
    { label: "Insurance & hedging instruments", amount: "€0.3M" },
    { label: "Contingency", amount: "€0.2M" },
  ],
};

// ─── GRADIENT COIL SUPPLIER DELAYS ───
const gradientCoilData: AlertContextData = {
  revenueAtRisk: 7.2,
  timeToImpact: "6 weeks",
  stockoutDate: "Apr 20",
  safetyStockWeeks: 6,
  depletionRate: "1.0 units/week",
  riskScore: 7.5,
  riskDelta: "↑ 3.1 from 4 weeks ago",
  strategyOptions: [
    {
      id: "labor-augmentation",
      name: "Specialist Labor Augmentation",
      description: "Deploy Philips engineering team to Erlangen facility to supplement coil winding specialists and accelerate production",
      cost: 1.2,
      timeline: "2-3 weeks",
      riskReduction: 65,
      revenueProtection: 75,
      feasibility: "HIGH",
      pros: ["Fast deployment", "Knowledge transfer", "Strengthens supplier relationship"],
      cons: ["Diverts internal engineering resources", "Travel & accommodation costs", "Cultural/language barriers"]
    },
    {
      id: "dual-source-coils",
      name: "Dual-Source Coil Manufacturing",
      description: "Qualify Siemens Healthineers' former coil supplier in Czech Republic as backup gradient coil manufacturer",
      cost: 3.8,
      timeline: "10-14 weeks",
      riskReduction: 85,
      revenueProtection: 90,
      feasibility: "MEDIUM",
      pros: ["Long-term supply security", "Competitive pricing leverage", "EU-based supplier"],
      cons: ["Long qualification timeline", "MRI-specific tooling investment", "Potential IP concerns"]
    },
    {
      id: "in-house-coils",
      name: "In-House Coil Production (Best, NL)",
      description: "Transfer gradient coil manufacturing to Philips Best facility using existing clean room infrastructure",
      cost: 6.5,
      timeline: "16-20 weeks",
      riskReduction: 92,
      revenueProtection: 95,
      feasibility: "LOW",
      pros: ["Full supply chain control", "Eliminates external dependency", "Quality oversight"],
      cons: ["Very high capex", "Long setup time", "Requires specialist recruitment", "Facility modification needed"]
    },
    {
      id: "customer-reschedule",
      name: "Customer Delivery Rescheduling",
      description: "Negotiate extended delivery windows with affected hospital customers, offering service credits and upgrade packages",
      cost: 0.8,
      timeline: "1-2 weeks",
      riskReduction: 30,
      revenueProtection: 60,
      feasibility: "HIGH",
      pros: ["Minimal cost", "Preserves customer relationship", "Buys time for supply recovery"],
      cons: ["Customer satisfaction impact", "Competitors may poach accounts", "Service credit liability"]
    }
  ],
  aiRecommendation: {
    strategy: "labor-augmentation",
    confidence: 82,
    reasoning: "The labor shortage at Erlangen is the bottleneck – deploying Philips' own MRI engineering specialists can accelerate production within 2-3 weeks, protecting €5.4M of the €7.2M at risk. This bridges the gap while dual-source qualification proceeds in parallel.",
    keyFactors: [
      "Root cause is specialist labor, not materials or equipment",
      "Philips has 8 qualified coil winding engineers available in Best facility",
      "Erlangen supplier has confirmed tooling capacity if staffing resolves",
      "Combined with customer rescheduling covers 90% of exposure"
    ]
  },
  affectedProducts: [
    { name: "Ingenia Elition 3.0T", units: 6, revenue: "€3.6M", status: "delayed" },
    { name: "Ingenia Ambition 1.5T", units: 4, revenue: "€2.4M", status: "at-risk" },
    { name: "MR 5300", units: 2, revenue: "€1.2M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Jan 20", event: "Erlangen supplier reports specialist resignations", type: "trigger" },
    { date: "Feb 5", event: "First delivery delay notification received", type: "trigger" },
    { date: "Feb 18", event: "Philips quality audit at supplier facility", type: "action" },
    { date: "Mar 6", event: "Current date – 12 systems in delay queue", type: "current" },
    { date: "Apr 20", event: "Next batch of 6 Elition systems due", type: "risk" },
    { date: "May 15", event: "Supplier expects full staffing recovery", type: "milestone" },
  ],
  supplierRiskData: [
    { name: "Erlangen Coil GmbH (Primary)", share: 80, risk: "Critical" },
    { name: "Czech Precision Mfg", share: 12, risk: "Low" },
    { name: "Philips Internal (Best)", share: 8, risk: "Low" },
  ],
  impactByRegion: [
    { region: "Europe", revenue: 3.6, systems: 6, percentage: 50 },
    { region: "North America", revenue: 2.2, systems: 4, percentage: 30 },
    { region: "APAC", revenue: 1.0, systems: 1, percentage: 14 },
    { region: "Middle East", revenue: 0.4, systems: 1, percentage: 6 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 3.5, inventoryWeeks: 10, deliveryDelay: 0 },
    { week: "W2", riskScore: 4.8, inventoryWeeks: 9, deliveryDelay: 2 },
    { week: "W3", riskScore: 5.9, inventoryWeeks: 8, deliveryDelay: 4 },
    { week: "W4", riskScore: 6.8, inventoryWeeks: 7, deliveryDelay: 6 },
    { week: "W5 (Now)", riskScore: 7.5, inventoryWeeks: 6, deliveryDelay: 8 },
    { week: "W6 (Proj)", riskScore: 8.0, inventoryWeeks: 5, deliveryDelay: 9 },
    { week: "W7 (Proj)", riskScore: 8.4, inventoryWeeks: 4, deliveryDelay: 10 },
    { week: "W8 (Proj)", riskScore: 8.7, inventoryWeeks: 3, deliveryDelay: 12 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "Key coil winding specialists resigned – 4 of 12 experts lost to automotive sector" },
    { label: "Contributing Factor", description: "Erlangen labor market tight – 2.1% unemployment, high competition for precision manufacturing skills" },
    { label: "Dependency Risk", description: "80% of Philips gradient coils from single Erlangen facility" },
    { label: "Quality Impact", description: "Remaining staff working overtime – reject rate increased from 2% to 5%" },
  ],
  costBreakdown: [
    { label: "Engineer deployment (8 staff)", amount: "€0.5M" },
    { label: "Travel & accommodation", amount: "€0.2M" },
    { label: "Production overtime premiums", amount: "€0.3M" },
    { label: "Quality oversight", amount: "€0.1M" },
    { label: "Contingency", amount: "€0.1M" },
  ],
};

// ─── PATIENT MONITOR DISPLAY SHORTAGE ───
const displayPanelData: AlertContextData = {
  revenueAtRisk: 4.2,
  timeToImpact: "10 weeks",
  stockoutDate: "May 15",
  safetyStockWeeks: 8,
  depletionRate: "0.8 weeks/week",
  riskScore: 5.8,
  riskDelta: "↑ 1.5 from 4 weeks ago",
  strategyOptions: [
    {
      id: "corning-qualification",
      name: "Corning Display Qualification",
      description: "Fast-track qualification of Corning's medical-grade 15\" LCD panels as alternative to current South Korean supplier",
      cost: 1.6,
      timeline: "6-8 weeks",
      riskReduction: 80,
      revenueProtection: 88,
      feasibility: "HIGH",
      pros: ["Corning has medical-grade certification", "US-based reduces APAC risk", "Competitive pricing"],
      cons: ["Color calibration differences", "Firmware update needed for IntelliVue", "Testing with existing bezels"]
    },
    {
      id: "display-size-substitute",
      name: "12\" Display Interim Substitution",
      description: "Temporarily offer IntelliVue MX800 with qualified 12\" display panels (available in stock) with software UI scaling",
      cost: 0.6,
      timeline: "2-3 weeks",
      riskReduction: 50,
      revenueProtection: 65,
      feasibility: "HIGH",
      pros: ["12\" panels in stock (200+ units)", "Quick software adaptation", "Maintains core functionality"],
      cons: ["Customer perception of downgrade", "UI readability reduced", "May require price adjustment"]
    },
    {
      id: "yield-improvement",
      name: "Supplier Yield Improvement Program",
      description: "Deploy Philips quality engineers to South Korean supplier to resolve yield issues on 15\" production line",
      cost: 0.9,
      timeline: "4-6 weeks",
      riskReduction: 60,
      revenueProtection: 72,
      feasibility: "MEDIUM",
      pros: ["Fixes root cause", "Strengthens supplier capability", "No product changes needed"],
      cons: ["Outcome uncertain", "Requires travel to South Korea", "Supplier cooperation dependent"]
    },
    {
      id: "touchscreen-upgrade",
      name: "Touchscreen Upgrade Path",
      description: "Offer affected customers upgraded touchscreen IntelliVue MX850 using readily available OLED panels",
      cost: 2.2,
      timeline: "4-5 weeks",
      riskReduction: 75,
      revenueProtection: 90,
      feasibility: "MEDIUM",
      pros: ["Upsell opportunity", "OLED panels available", "Better customer outcome"],
      cons: ["Higher BOM cost per unit", "Software validation needed", "Not all customers want upgrade"]
    }
  ],
  aiRecommendation: {
    strategy: "corning-qualification",
    confidence: 84,
    reasoning: "Corning already holds ISO 13485 medical-grade certification for displays, making qualification 40% faster than typical new suppliers. Combined with interim 12\" substitution for urgent orders, this covers 88% of revenue exposure within 8 weeks.",
    keyFactors: [
      "Corning has existing medical display certification (ISO 13485)",
      "South Korean supplier yield issues may persist 3+ months",
      "IntelliVue firmware can support Corning panels with minor update",
      "Dual-source strategy prevents future single-supplier risk"
    ]
  },
  affectedProducts: [
    { name: "IntelliVue MX800", units: 45, revenue: "€2.7M", status: "delayed" },
    { name: "IntelliVue MX750", units: 20, revenue: "€1.0M", status: "at-risk" },
    { name: "IntelliVue MX550", units: 10, revenue: "€0.5M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Feb 1", event: "SK supplier reports 15\" panel yield drop to 62%", type: "trigger" },
    { date: "Feb 10", event: "IntelliVue MX800 production reduced 20%", type: "trigger" },
    { date: "Feb 25", event: "Corning contacted for alternative qualification", type: "action" },
    { date: "Mar 6", event: "Current date – 8 weeks of 15\" panel stock remaining", type: "current" },
    { date: "May 1", event: "Corning sample panels expected for testing", type: "milestone" },
    { date: "May 15", event: "Current panel stock depleted if yield doesn't improve", type: "risk" },
  ],
  supplierRiskData: [
    { name: "SK Display Co. (Primary)", share: 75, risk: "Critical" },
    { name: "Corning (Qualifying)", share: 0, risk: "Low" },
    { name: "LG Display", share: 20, risk: "Medium" },
    { name: "Others", share: 5, risk: "Low" },
  ],
  impactByRegion: [
    { region: "North America", revenue: 1.8, systems: 30, percentage: 43 },
    { region: "Europe", revenue: 1.4, systems: 25, percentage: 33 },
    { region: "APAC", revenue: 0.7, systems: 12, percentage: 17 },
    { region: "LATAM", revenue: 0.3, systems: 8, percentage: 7 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 3.0, inventoryWeeks: 12, deliveryDelay: 0 },
    { week: "W2", riskScore: 3.5, inventoryWeeks: 11, deliveryDelay: 0 },
    { week: "W3", riskScore: 4.2, inventoryWeeks: 10, deliveryDelay: 1 },
    { week: "W4", riskScore: 4.9, inventoryWeeks: 9, deliveryDelay: 1 },
    { week: "W5 (Now)", riskScore: 5.8, inventoryWeeks: 8, deliveryDelay: 2 },
    { week: "W6 (Proj)", riskScore: 6.5, inventoryWeeks: 7, deliveryDelay: 3 },
    { week: "W7 (Proj)", riskScore: 7.0, inventoryWeeks: 6, deliveryDelay: 4 },
    { week: "W8 (Proj)", riskScore: 7.6, inventoryWeeks: 5, deliveryDelay: 5 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "Manufacturing yield on 15\" medical-grade LCD panels dropped from 88% to 62%" },
    { label: "Contributing Factor", description: "New thin-film transistor process introduced without adequate testing" },
    { label: "Dependency Risk", description: "75% of medical display panels from single South Korean supplier" },
    { label: "Quality Impact", description: "Color accuracy and brightness uniformity failing medical specifications" },
  ],
  costBreakdown: [
    { label: "Corning qualification testing", amount: "€0.5M" },
    { label: "Firmware adaptation", amount: "€0.3M" },
    { label: "Regulatory submission", amount: "€0.4M" },
    { label: "Sample procurement", amount: "€0.2M" },
    { label: "Contingency", amount: "€0.2M" },
  ],
};

// ─── ZHUHAI FACTORY MAINTENANCE ───
const zhuhaiFactoryData: AlertContextData = {
  revenueAtRisk: 2.8,
  timeToImpact: "3 weeks",
  stockoutDate: "Mar 27",
  safetyStockWeeks: 4,
  depletionRate: "Reduced output 15%",
  riskScore: 5.2,
  riskDelta: "↑ 1.0 from 2 weeks ago",
  strategyOptions: [
    {
      id: "line-shift",
      name: "Production Line Shift (#2 & #3)",
      description: "Redistribute Sonicare DiamondClean production from line #4 to lines #2 and #3 with overtime scheduling",
      cost: 0.4,
      timeline: "1 week",
      riskReduction: 70,
      revenueProtection: 80,
      feasibility: "HIGH",
      pros: ["Lines #2 and #3 have 85% compatible tooling", "Immediate capacity recovery", "Minimal cost"],
      cons: ["Overtime premium costs", "Slight product mix limitation", "Worker fatigue risk"]
    },
    {
      id: "expedited-maintenance",
      name: "Expedited Maintenance with OEM Support",
      description: "Bring in motor calibration specialists from equipment OEM (Fanuc) to resolve calibration issues in parallel with production",
      cost: 0.8,
      timeline: "1-2 weeks",
      riskReduction: 90,
      revenueProtection: 92,
      feasibility: "HIGH",
      pros: ["Fixes root cause permanently", "OEM warranty coverage", "Prevents future recurrence"],
      cons: ["Fanuc specialist availability", "Partial line stoppage during fix", "Travel logistics to Zhuhai"]
    },
    {
      id: "inventory-pull-forward",
      name: "Finished Goods Pull-Forward",
      description: "Pull forward Sonicare inventory from regional distribution centers to cover the 3-week production gap",
      cost: 0.2,
      timeline: "Immediate",
      riskReduction: 45,
      revenueProtection: 60,
      feasibility: "HIGH",
      pros: ["No production changes needed", "Immediate availability", "Zero capital investment"],
      cons: ["Depletes regional safety stock", "Logistics costs for redistribution", "Only covers 3 weeks"]
    },
    {
      id: "contract-manufacturing",
      name: "Temporary Contract Manufacturing",
      description: "Engage contract manufacturer in Dongguan for Sonicare handle assembly during maintenance window",
      cost: 1.5,
      timeline: "3-4 weeks",
      riskReduction: 60,
      revenueProtection: 70,
      feasibility: "MEDIUM",
      pros: ["Maintains full production volume", "Dongguan CM has electronics experience", "Scalable"],
      cons: ["Quality control risk", "IP exposure concerns", "Setup time longer than maintenance window"]
    }
  ],
  aiRecommendation: {
    strategy: "expedited-maintenance",
    confidence: 91,
    reasoning: "The motor calibration issue on line #4 is the root cause. Engaging Fanuc OEM specialists resolves the issue permanently with 90% risk reduction. Combined with line shifting to #2/#3 as interim measure, this maintains 85% capacity during repair and achieves full recovery in 2 weeks.",
    keyFactors: [
      "Root cause is motor calibration – not general equipment failure",
      "Fanuc has confirmed specialist availability within 5 business days",
      "Lines #2 and #3 can absorb 65% of line #4 volume with overtime",
      "Maintenance window expected to close within 2 weeks"
    ]
  },
  affectedProducts: [
    { name: "Sonicare DiamondClean Smart", units: 12000, revenue: "€1.4M", status: "delayed" },
    { name: "Sonicare ExpertClean", units: 8000, revenue: "€0.8M", status: "at-risk" },
    { name: "Sonicare ProtectiveClean", units: 6000, revenue: "€0.6M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Feb 20", event: "Planned maintenance on line #4 begins", type: "trigger" },
    { date: "Feb 25", event: "Motor calibration issues discovered during restart", type: "trigger" },
    { date: "Mar 1", event: "Production shifted to lines #2 and #3", type: "action" },
    { date: "Mar 6", event: "Current date – line #4 still down, 85% capacity", type: "current" },
    { date: "Mar 15", event: "Fanuc specialist arrives on-site", type: "milestone" },
    { date: "Mar 27", event: "Target: line #4 back to full operation", type: "milestone" },
  ],
  supplierRiskData: [
    { name: "Line #4 (Down)", share: 40, risk: "Critical" },
    { name: "Line #2 (Active)", share: 30, risk: "Low" },
    { name: "Line #3 (Active)", share: 25, risk: "Low" },
    { name: "Line #1 (Other products)", share: 5, risk: "Low" },
  ],
  impactByRegion: [
    { region: "APAC", revenue: 1.1, systems: 10000, percentage: 39 },
    { region: "Europe", revenue: 0.8, systems: 8000, percentage: 29 },
    { region: "North America", revenue: 0.6, systems: 5000, percentage: 21 },
    { region: "LATAM", revenue: 0.3, systems: 3000, percentage: 11 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 2.0, inventoryWeeks: 8, deliveryDelay: 0 },
    { week: "W2", riskScore: 3.5, inventoryWeeks: 6, deliveryDelay: 0 },
    { week: "W3 (Now)", riskScore: 5.2, inventoryWeeks: 4, deliveryDelay: 1 },
    { week: "W4 (Proj)", riskScore: 5.0, inventoryWeeks: 3, deliveryDelay: 1 },
    { week: "W5 (Proj)", riskScore: 3.5, inventoryWeeks: 4, deliveryDelay: 0 },
    { week: "W6 (Proj)", riskScore: 2.0, inventoryWeeks: 6, deliveryDelay: 0 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "Servo motor calibration drift on line #4 automated assembly – exceeds 0.02mm tolerance" },
    { label: "Contributing Factor", description: "Calibration tool firmware not updated during planned maintenance cycle" },
    { label: "Dependency Risk", description: "Line #4 handles 40% of Sonicare DiamondClean production volume" },
    { label: "Quality Impact", description: "Assembly precision dropping – reject rate increased from 1.2% to 3.8%" },
  ],
  costBreakdown: [
    { label: "Fanuc specialist engagement", amount: "€0.3M" },
    { label: "Replacement servo motors", amount: "€0.2M" },
    { label: "Overtime premium (lines #2/#3)", amount: "€0.1M" },
    { label: "Production validation", amount: "€0.1M" },
    { label: "Contingency", amount: "€0.1M" },
  ],
};

// ─── BATTERY CELL SUPPLY CONSTRAINT ───
const batteryData: AlertContextData = {
  revenueAtRisk: 3.5,
  timeToImpact: "8 weeks",
  stockoutDate: "May 1",
  safetyStockWeeks: 6,
  depletionRate: "0.75 weeks/week",
  riskScore: 5.5,
  riskDelta: "↑ 1.8 from 4 weeks ago",
  strategyOptions: [
    {
      id: "cell-supplier-diversify",
      name: "Battery Cell Supplier Diversification",
      description: "Qualify Panasonic and Samsung SDI medical-grade lithium-ion cells as alternatives to current constrained supplier",
      cost: 2.0,
      timeline: "6-8 weeks",
      riskReduction: 80,
      revenueProtection: 85,
      feasibility: "HIGH",
      pros: ["Both have medical device battery experience", "Multiple geographies reduce risk", "Competitive pricing"],
      cons: ["IEC 62133 re-certification needed", "Battery management firmware update", "Minimum order quantities"]
    },
    {
      id: "battery-redesign",
      name: "Extended Battery Life Redesign",
      description: "Redesign Lumify power management to extend battery life 40%, reducing replacement cell demand",
      cost: 1.8,
      timeline: "12-14 weeks",
      riskReduction: 55,
      revenueProtection: 65,
      feasibility: "MEDIUM",
      pros: ["Reduces cell consumption long-term", "Better user experience", "Marketing advantage"],
      cons: ["Long development cycle", "FDA 510(k) may be required", "Software validation extensive"]
    },
    {
      id: "refurbishment-program",
      name: "Battery Refurbishment Program",
      description: "Implement cell reconditioning and refurbishment for returned Lumify batteries, extending lifecycle by 60%",
      cost: 0.6,
      timeline: "3-4 weeks",
      riskReduction: 40,
      revenueProtection: 55,
      feasibility: "HIGH",
      pros: ["Low cost", "Sustainability benefit", "Reduces new cell demand 25%", "Customer goodwill"],
      cons: ["Refurbished cell performance variance", "Warranty implications", "Collection logistics"]
    },
    {
      id: "allocation-management",
      name: "Allocation & Rationing Strategy",
      description: "Implement allocation-based ordering for Lumify batteries – prioritize new device sales over replacement batteries",
      cost: 0.3,
      timeline: "1 week",
      riskReduction: 30,
      revenueProtection: 50,
      feasibility: "HIGH",
      pros: ["Immediate implementation", "Protects new unit sales", "Data-driven allocation"],
      cons: ["Frustrates replacement battery customers", "Service contract risk", "Reputational concern"]
    }
  ],
  aiRecommendation: {
    strategy: "cell-supplier-diversify",
    confidence: 85,
    reasoning: "Panasonic already supplies medical-grade cells for similar portable ultrasound devices (competitor products), reducing qualification risk. Combined with the refurbishment program for interim demand reduction, this provides 80% risk reduction with strong feasibility.",
    keyFactors: [
      "Current supplier at 80% capacity with 6-week lead time extension",
      "Panasonic has existing IEC 62133 certification for medical cells",
      "Samsung SDI offers competitive pricing at 12% below current supplier",
      "Lumify unit demand growing 25% YoY – single source unsustainable"
    ]
  },
  affectedProducts: [
    { name: "Lumify Handheld Ultrasound", units: 200, revenue: "€2.0M", status: "delayed" },
    { name: "Lumify Battery Replacements", units: 500, revenue: "€0.8M", status: "at-risk" },
    { name: "Lumify Service Kits", units: 150, revenue: "€0.7M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Jan 15", event: "Battery supplier announces capacity constraints", type: "trigger" },
    { date: "Feb 1", event: "Lead times extended from 4 to 10 weeks", type: "trigger" },
    { date: "Feb 20", event: "Panasonic contacted for qualification", type: "action" },
    { date: "Mar 6", event: "Current date – production at 80% capacity", type: "current" },
    { date: "Apr 15", event: "Panasonic sample cells expected", type: "milestone" },
    { date: "May 1", event: "Current cell inventory projected depleted", type: "risk" },
  ],
  supplierRiskData: [
    { name: "MedBatt Corp (Primary)", share: 85, risk: "Critical" },
    { name: "Panasonic (Qualifying)", share: 0, risk: "Low" },
    { name: "Samsung SDI (Prospect)", share: 0, risk: "Low" },
    { name: "Others", share: 15, risk: "Medium" },
  ],
  impactByRegion: [
    { region: "North America", revenue: 1.8, systems: 120, percentage: 51 },
    { region: "Europe", revenue: 1.0, systems: 60, percentage: 29 },
    { region: "APAC", revenue: 0.5, systems: 40, percentage: 14 },
    { region: "LATAM", revenue: 0.2, systems: 15, percentage: 6 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 2.8, inventoryWeeks: 10, deliveryDelay: 0 },
    { week: "W2", riskScore: 3.4, inventoryWeeks: 9, deliveryDelay: 0 },
    { week: "W3", riskScore: 4.2, inventoryWeeks: 8, deliveryDelay: 1 },
    { week: "W4", riskScore: 4.8, inventoryWeeks: 7, deliveryDelay: 2 },
    { week: "W5 (Now)", riskScore: 5.5, inventoryWeeks: 6, deliveryDelay: 2 },
    { week: "W6 (Proj)", riskScore: 6.2, inventoryWeeks: 5, deliveryDelay: 3 },
    { week: "W7 (Proj)", riskScore: 6.8, inventoryWeeks: 4, deliveryDelay: 4 },
    { week: "W8 (Proj)", riskScore: 7.5, inventoryWeeks: 3, deliveryDelay: 5 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "Battery cell supplier capacity maxed – EV sector consuming 70% of lithium-ion cell production" },
    { label: "Contributing Factor", description: "Medical-grade cell demand growing 25% YoY with portable ultrasound market expansion" },
    { label: "Dependency Risk", description: "85% single-source dependency for all Lumify battery cells" },
    { label: "Quality Impact", description: "No quality issues – purely a capacity and allocation constraint" },
  ],
  costBreakdown: [
    { label: "Panasonic qualification", amount: "€0.7M" },
    { label: "Samsung SDI qualification", amount: "€0.5M" },
    { label: "BMS firmware adaptation", amount: "€0.3M" },
    { label: "IEC 62133 re-certification", amount: "€0.3M" },
    { label: "Contingency", amount: "€0.2M" },
  ],
};

// ─── HELIUM SUPPLY STABILITY ───
const heliumData: AlertContextData = {
  revenueAtRisk: 4.8,
  timeToImpact: "14 weeks",
  stockoutDate: "Jun 15",
  safetyStockWeeks: 12,
  depletionRate: "0.6 weeks/week",
  riskScore: 4.8,
  riskDelta: "↑ 1.2 from 4 weeks ago",
  strategyOptions: [
    {
      id: "helium-free-migration",
      name: "Accelerated Helium-Free Migration",
      description: "Fast-track customer migration from legacy helium-cooled MRI systems to Ingenia Ambition helium-free platform",
      cost: 3.5,
      timeline: "8-12 weeks",
      riskReduction: 92,
      revenueProtection: 95,
      feasibility: "HIGH",
      pros: ["Eliminates helium dependency entirely", "Customer gets upgraded system", "Recurring service revenue", "Sustainability win"],
      cons: ["High upfront investment per customer", "Installation scheduling complexity", "Training for hospital staff"]
    },
    {
      id: "helium-recycling",
      name: "Closed-Loop Helium Recycling",
      description: "Deploy helium recapture and recycling systems at major hospital clusters to reduce consumption by 60%",
      cost: 2.2,
      timeline: "6-8 weeks",
      riskReduction: 65,
      revenueProtection: 75,
      feasibility: "MEDIUM",
      pros: ["Reduces helium consumption 60%", "Applicable to all legacy MRI", "Green technology credential"],
      cons: ["Capital investment per site", "Technical complexity of recapture", "Hospital facility modifications"]
    },
    {
      id: "alternative-helium",
      name: "Alternative Helium Sourcing",
      description: "Secure helium supply from Qatar (RasGas) and Algeria to reduce dependency on US BLM reserve",
      cost: 1.5,
      timeline: "4-6 weeks",
      riskReduction: 58,
      revenueProtection: 70,
      feasibility: "HIGH",
      pros: ["Diversified supply geography", "Qatar has expanding capacity", "Long-term contracts available"],
      cons: ["Longer shipping routes", "Higher per-unit cost", "Geopolitical risk in MENA region"]
    },
    {
      id: "service-optimization",
      name: "Service Visit Helium Optimization",
      description: "Optimize MRI service protocols to minimize helium loss during maintenance, reducing consumption per service visit by 35%",
      cost: 0.4,
      timeline: "2-3 weeks",
      riskReduction: 30,
      revenueProtection: 45,
      feasibility: "HIGH",
      pros: ["Low cost implementation", "Applicable immediately", "Improves service efficiency"],
      cons: ["Limited impact alone", "Requires field engineer retraining", "Only addresses service consumption"]
    }
  ],
  aiRecommendation: {
    strategy: "helium-free-migration",
    confidence: 93,
    reasoning: "The long-term strategic answer is clear: accelerate Ambition helium-free adoption. This eliminates helium dependency entirely (92% risk reduction) while generating upgrade revenue. With BLM reserve declining and helium prices volatile, helium-free technology is Philips' competitive advantage.",
    keyFactors: [
      "BLM helium reserve declining – 30% allocation cut this year",
      "Ingenia Ambition uses <1L helium vs. 1,500L for legacy systems",
      "42 legacy MRI customers already on upgrade waitlist",
      "Each migration generates €200K service revenue + €800K system revenue"
    ]
  },
  affectedProducts: [
    { name: "Legacy MRI Service Contracts", units: 85, revenue: "€2.4M", status: "at-risk" },
    { name: "MRI Helium Refill Services", units: 120, revenue: "€1.2M", status: "delayed" },
    { name: "Legacy MRI Spare Parts", units: 200, revenue: "€0.8M", status: "monitoring" },
    { name: "New Legacy MRI Installations", units: 5, revenue: "€0.4M", status: "monitoring" },
  ],
  timelineEvents: [
    { date: "Dec 15", event: "BLM announces 30% helium reserve allocation cut", type: "trigger" },
    { date: "Jan 10", event: "Helium spot price increases 15%", type: "trigger" },
    { date: "Feb 1", event: "Philips activates helium conservation protocols", type: "action" },
    { date: "Feb 15", event: "Accelerated Ambition migration program launched", type: "action" },
    { date: "Mar 6", event: "Current date – 12 weeks of helium supply remaining", type: "current" },
    { date: "Jun 15", event: "Projected helium supply constrained for legacy fleet", type: "risk" },
  ],
  supplierRiskData: [
    { name: "US BLM Reserve", share: 45, risk: "Critical" },
    { name: "Qatar (RasGas)", share: 25, risk: "Medium" },
    { name: "Algeria", share: 20, risk: "Medium" },
    { name: "Others", share: 10, risk: "Low" },
  ],
  impactByRegion: [
    { region: "North America", revenue: 2.2, systems: 45, percentage: 46 },
    { region: "Europe", revenue: 1.5, systems: 30, percentage: 31 },
    { region: "APAC", revenue: 0.8, systems: 15, percentage: 17 },
    { region: "LATAM", revenue: 0.3, systems: 5, percentage: 6 },
  ],
  weeklyTrendData: [
    { week: "W1", riskScore: 2.5, inventoryWeeks: 16, deliveryDelay: 0 },
    { week: "W2", riskScore: 3.0, inventoryWeeks: 15, deliveryDelay: 0 },
    { week: "W3", riskScore: 3.5, inventoryWeeks: 14, deliveryDelay: 0 },
    { week: "W4", riskScore: 4.0, inventoryWeeks: 13, deliveryDelay: 1 },
    { week: "W5 (Now)", riskScore: 4.8, inventoryWeeks: 12, deliveryDelay: 1 },
    { week: "W6 (Proj)", riskScore: 5.5, inventoryWeeks: 11, deliveryDelay: 2 },
    { week: "W7 (Proj)", riskScore: 6.0, inventoryWeeks: 10, deliveryDelay: 2 },
    { week: "W8 (Proj)", riskScore: 6.8, inventoryWeeks: 8, deliveryDelay: 3 },
  ],
  rootCauses: [
    { label: "Primary Cause", description: "US Bureau of Land Management reducing helium reserve allocation by 30% due to reserve depletion" },
    { label: "Contributing Factor", description: "Growing helium demand from semiconductor and space industries (+20% YoY)" },
    { label: "Dependency Risk", description: "45% of Philips helium supply from single US government source" },
    { label: "Strategic Factor", description: "Helium is a non-renewable resource – long-term supply fundamentally declining" },
  ],
  costBreakdown: [
    { label: "Customer migration subsidies", amount: "€1.5M" },
    { label: "Ambition system installations", amount: "€1.0M" },
    { label: "Legacy system decommissioning", amount: "€0.4M" },
    { label: "Staff training & certification", amount: "€0.3M" },
    { label: "Contingency", amount: "€0.3M" },
  ],
};

// ─── LOOKUP FUNCTION ───
export function getAlertContextData(alertTitle: string): AlertContextData {
  const title = alertTitle.toLowerCase();

  if (title.includes("semiconductor") || title.includes("tsmc")) return semiconductorData;
  if (title.includes("rare earth") || title.includes("neodymium")) return rareEarthData;
  if (title.includes("gradient coil") || title.includes("erlangen")) return gradientCoilData;
  if (title.includes("display panel") || title.includes("monitor display")) return displayPanelData;
  if (title.includes("zhuhai") || title.includes("equipment maintenance")) return zhuhaiFactoryData;
  if (title.includes("battery") || title.includes("lumify")) return batteryData;
  if (title.includes("helium") || title.includes("blr plant")) return heliumData;

  // Fallback to semiconductor data
  return semiconductorData;
}
