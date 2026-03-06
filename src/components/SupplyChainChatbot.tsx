import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Analyze current semiconductor supply risks and mitigation strategies",
  "What's the impact of the chip shortage on MRI system deliveries?",
  "Identify cost savings opportunities across our medical device supply chain",
  "Provide an executive summary of Philips supply chain performance",
  "How can we optimize our healthcare distribution network?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "semiconductor": `**Semiconductor Supply Risk Analysis – Philips Healthcare**

🔴 **Current Risk Level: HIGH**

**Key Findings:**
• TSMC allocation for medical-grade chips reduced by 15% due to consumer electronics demand surge
• Lead times extended from 16 weeks to 28 weeks for custom ASICs
• Automotive sector competing for same chip fabrication capacity

**Mitigation Strategies:**
1. **Dual-Source Qualification** – Samsung Foundry pre-qualified for 65nm medical ASICs (ETA: Q3)
2. **Design Redesign** – Engineering team evaluating chip consolidation to reduce unique part numbers by 30%
3. **Strategic Reserves** – 14-week safety stock maintained for Tier 1 critical components
4. **Long-Term Agreements** – Negotiating 3-year capacity reservation with TSMC at +8% premium

**Estimated Impact:** €18M revenue at risk if no action taken within 8 weeks.`,

  "mri": `**MRI System Delivery Impact Assessment**

📊 **Current Situation:**
• 24 MRI systems delayed due to gradient coil component shortage
• Ingenia Ambition 1.5T and Ingenia Elition 3.0T most affected
• Helium-free MRI systems (Ambition) have alternative supply path

**Delivery Timeline Impact:**
| System | Original ETA | Revised ETA | Delay |
|--------|-------------|-------------|-------|
| Ingenia Ambition | Q1 2026 | Q2 2026 | 6 weeks |
| Ingenia Elition | Q1 2026 | Q3 2026 | 12 weeks |
| MR 5300 | Q2 2026 | Q2 2026 | On track |

**Revenue Impact:** €18M in deferred revenue, €4.2M at risk of cancellation

**Recommended Actions:**
1. Prioritize helium-free Ambition systems (shorter alternative supply chain)
2. Offer temporary Ingenia upgrade packages to retain customers
3. Accelerate South Korea supplier qualification for gradient coils`,

  "cost": `**Cost Savings Opportunities – Philips Supply Chain**

💰 **Total Identified Savings: €42M annually**

**Top 5 Opportunities:**

1. **Consolidated Logistics** (€14M) – Merge Personal Health and Healthcare distribution in APAC region. Shared warehousing reduces fixed costs 22%.

2. **Component Standardization** (€11M) – Reduce unique part numbers across patient monitoring platforms from 8,400 to 5,200. Shared connectors, power supplies, and displays.

3. **Predictive Maintenance** (€8M) – Deploy IoT sensors on manufacturing equipment at Best and Böblingen facilities. Reduce unplanned downtime by 35%.

4. **Supplier Consolidation** (€6M) – Reduce packaging suppliers from 28 to 12. Leverage volume for 18% unit cost reduction.

5. **Near-Shoring** (€3M) – Move PCB assembly for European market from China to Romania. Reduce logistics cost and lead time by 40%.`,

  "executive": `**Philips Supply Chain – Executive Summary**

📈 **Q1 2026 Performance Dashboard**

**Overall Health Score: 7.2/10** (↑ from 6.8 last quarter)

**Key Metrics:**
• Supply Continuity: 94.2% (target: 97%)
• On-Time Delivery: 89% (target: 95%)
• Inventory Turns: 6.8x (target: 7.5x)
• Supplier Quality: 98.1% (target: 99%)

**Critical Issues (3):**
🔴 Semiconductor shortage – affecting MRI & CT production
🟠 Rare earth price volatility – +22% YoY impacting motor costs
🟠 Suez Canal rerouting – +€2.4M logistics cost per quarter

**Wins:**
✅ Helium-free MRI adoption reducing supply dependency by 40%
✅ New Samsung chip qualification ahead of schedule
✅ Personal Health factory in Zhuhai achieved record OEE of 89%

**30-Day Priorities:**
1. Execute semiconductor alternative sourcing plan
2. Complete rare earth hedging strategy
3. Finalize APAC logistics consolidation business case`,

  "distribution": `**Healthcare Distribution Network Optimization**

🏥 **Current Network Analysis:**

**Utilization by Region:**
• Europe (Eindhoven hub): 84% – well balanced
• North America (Nashville): 87% – approaching capacity
• APAC (Singapore): 79% – underutilized

**Optimization Recommendations:**

1. **APAC Hub Expansion** – Route India/ANZ orders through Singapore instead of Netherlands. Reduces transit time 8 days, saves €1.2M/year in air freight.

2. **Nashville Overflow** – Partner with UPS Healthcare for overflow capacity. Avoid €15M facility expansion. Pay-per-use model at 30% lower cost.

3. **Last-Mile Innovation** – Deploy Philips Mobile Service Units in top 20 metro areas. Same-day delivery capability for critical spare parts. Projected 18% improvement in field service response.

4. **Digital Twin Deployment** – Model entire distribution network in real-time. AI-driven demand sensing reduces safety stock by 12% while maintaining 99.5% fill rate.`
};

const getResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();
  if (lower.includes("semiconductor") || lower.includes("chip")) return MOCK_RESPONSES["semiconductor"];
  if (lower.includes("mri") || lower.includes("shortage")) return MOCK_RESPONSES["mri"];
  if (lower.includes("cost") || lower.includes("saving")) return MOCK_RESPONSES["cost"];
  if (lower.includes("executive") || lower.includes("summary") || lower.includes("performance")) return MOCK_RESPONSES["executive"];
  if (lower.includes("distribution") || lower.includes("network") || lower.includes("optimize")) return MOCK_RESPONSES["distribution"];
  
  return `Thank you for your question. Based on Philips' current supply chain data, here are the key insights:

**Supply Chain Status:** 13 of 15 network nodes operational. 1 critical issue (semiconductor supply), 1 warning (component availability).

**Active Alerts:** 8 supply chain alerts across Diagnosis & Treatment, Connected Care, and Personal Health business units.

**Recommendation:** Focus on the semiconductor sourcing strategy and APAC logistics optimization for maximum impact. Would you like me to drill deeper into any specific area?`;
};

const SupplyChainChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Philips Supply Chain AI Assistant. I can help you with:\n\n• Medical device supply chain insights and analytics\n• Cost savings opportunities across healthcare operations\n• Executive-level summaries and KPI dashboards\n• Risk analysis for semiconductor and component shortages\n• Distribution network optimization recommendations\n\nHow can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      role: "assistant",
      content: getResponse(textToSend)
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Supply Chain AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ask about supply chain insights, risk analysis, cost savings, and executive summaries
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Powered by AI</span>
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-3 px-4 text-left justify-start hover:bg-primary/5 hover:border-primary"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
              >
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Brain className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="text-sm text-muted-foreground">Analyzing Philips supply chain data...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about supply chain insights, risk analysis, or executive summaries..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainChatbot;
