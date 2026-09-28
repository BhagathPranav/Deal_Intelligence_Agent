"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, Search, ArrowUpRight, Zap, Activity, Hexagon,
  Users, LayoutDashboard, Trophy, Menu, ArrowUp, Send, Bot, User, CheckCircle2, FileText, UploadCloud
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

export default function SonexoDashboard() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);

  const showToast = (msg: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Strategy State
  const [strategyQuestion, setStrategyQuestion] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [strategyHistory, setStrategyHistory] = useState<ChatMessage[]>([]);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  // Briefing State
  const [accountName, setAccountName] = useState("");
  const [briefingResponse, setBriefingResponse] = useState("");
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Battlecard State
  const [battlecardCompetitor, setBattlecardCompetitor] = useState("");
  const [battlecardResponse, setBattlecardResponse] = useState("");
  const [isBattlecardLoading, setIsBattlecardLoading] = useState(false);

  // Email State
  const [emailAccountName, setEmailAccountName] = useState("");
  const [emailReason, setEmailReason] = useState("");
  const [emailResponse, setEmailResponse] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [agentTrace, setAgentTrace] = useState<string[]>([]);
  const [isTraceVisible, setIsTraceVisible] = useState(false);

  const [extractCompetitors, setExtractCompetitors] = useState(true);
  const [extractPainPoints, setExtractPainPoints] = useState(true);
  const [extractActionItems, setExtractActionItems] = useState(true);

  // Rotating Insights State
  const insights = [
    "⚠️ TechNova just lowered pricing by 20% on Enterprise tier. Re-evaluate CloudSync deal strategy immediately.",
    "🚀 New Feature Request detected in Acme Corp transcript. Triggering product team sync.",
    "💡 GlobalNet Deal Health dropped by 12%. Recommending immediate executive escalation.",
    "🔍 Competitor analysis complete. We win 80% of deals against OmniCorp when pitching 'Zero-Downtime'."
  ];
  const [insightIndex, setInsightIndex] = useState(0);

  // Table Expansion States
  const [showAllReps, setShowAllReps] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const addTrace = (logs: string[]) => {
    setIsTraceVisible(true);
    setAgentTrace([]);
    let currentTrace = [...logs];
    
    // Simulate streaming logs
    const interval = setInterval(() => {
      if (currentTrace.length === 0) {
        clearInterval(interval);
        setTimeout(() => setIsTraceVisible(false), 5000);
        return;
      }
      setAgentTrace(prev => [...prev, currentTrace.shift() as string]);
    }, 400);
  };

  // Learning State
  const [dealId, setDealId] = useState("");
  const [notes, setNotes] = useState("");
  const [learningStatus, setLearningStatus] = useState("");
  const [isLearningLoading, setIsLearningLoading] = useState(false);

  const runStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategyQuestion.trim() || !competitor.trim()) return;

    const userMessage = "Context: " + competitor + ". Question: " + strategyQuestion;
    setStrategyHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsStrategyLoading(true);
    
    addTrace([
      "> Authenticating with HydraDB Graph...",
      "> MATCH (d:Deal)-[:COMPETED_AGAINST]->(c:Competitor {name: '" + competitor + "'})",
      "> Retrieving 4 past lost deals...",
      "> Querying Hindsight Vector DB for unstructured notes...",
      "> Found 22 relevant transcripts.",
      "> Executing RocketRide Strategy Pipeline...",
      "> Synthesizing LLM response..."
    ]);

    const q = strategyQuestion;
    const c = competitor;
    setStrategyQuestion("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "strategy",
          payload: { question: q, competitor: c }
        })
      });
      const data = await res.json();
      const output = data.data?.output || JSON.stringify(data.data) || "No response received.";
      setStrategyHistory((prev) => [...prev, { role: "agent", content: output }]);
    } catch (err: any) {
      setStrategyHistory((prev) => [...prev, { role: "agent", content: "Error: " + err.message }]);
    }
    setIsStrategyLoading(false);
  };

  const runBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBriefingLoading(true);
    setBriefingResponse("");
    addTrace([
      "> Connecting to Neo4j instance...",
      "> MATCH (a:Account {name: '" + accountName + "'})<-[:BELONGS_TO]-(d:Deal)",
      "> Extracting related Products and Features requested...",
      "> Context limit check: OK",
      "> Formulating Executive Briefing..."
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "briefing",
          payload: { account_name: accountName }
        })
      });
      const data = await res.json();
      setBriefingResponse(data.data?.output || JSON.stringify(data.data) || "No response received.");
    } catch (err: any) {
      setBriefingResponse("Error: " + err.message);
    }
    setIsBriefingLoading(false);
  };

  const runBattlecard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBattlecardLoading(true);
    setBattlecardResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "battlecard",
          payload: { competitor: battlecardCompetitor }
        })
      });
      const data = await res.json();
      setBattlecardResponse(data.data?.output || JSON.stringify(data.data) || "No response received.");
    } catch (err: any) {
      setBattlecardResponse("Error: " + err.message);
    }
    setIsBattlecardLoading(false);
  };

  const runEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setEmailResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "email",
          payload: { account_name: emailAccountName, reason: emailReason }
        })
      });
      const data = await res.json();
      setEmailResponse(data.data?.output || JSON.stringify(data.data) || "No response received.");
    } catch (err: any) {
      setEmailResponse("Error: " + err.message);
    }
    setIsEmailLoading(false);
  };

  const runLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLearningLoading(true);
    setLearningStatus("");
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, notes })
      });
      const data = await res.json();
      if (data.success) {
        setLearningStatus("Notes successfully ingested into Hindsight!");
        setDealId("");
        setNotes("");
        setTimeout(() => setLearningStatus(""), 4000);
      } else {
        setLearningStatus("Error: " + data.error);
      }
    } catch (err: any) {
      setLearningStatus("Error: " + err.message);
    }
    setIsLearningLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-8 overflow-hidden">
      
      {/* Top Navigation */}
      <nav className="flex items-center justify-between mb-8 border-b border-[#222] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4d00] to-[#ff8c00] flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.4)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-medium tracking-wide">Nexus Agent Swarm</span>
        </div>
        
        <div className="hidden md:flex items-center gap-3 text-sm font-medium">
          <button 
            onClick={() => showToast("You are already in the Agent Workspace!")} 
            className="text-white bg-[#222] border border-[#333] px-4 py-2 rounded-lg transition-all shadow-md"
          >
            Workspace
          </button>
          <button 
            onClick={() => showToast("Pipelines are managed in the Agent Codebase.")} 
            className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] px-4 py-2 rounded-lg transition-all"
          >
            Pipelines
          </button>
          
          <div className="w-[1px] h-6 bg-[#333] mx-2"></div>

          <button 
            onClick={() => showToast("Agent Swarm is online and listening!")} 
            className="group flex items-center gap-2 bg-[#ff4d00]/10 border border-[#ff4d00]/30 hover:bg-[#ff4d00]/20 hover:border-[#ff4d00]/60 px-4 py-2 rounded-full cursor-pointer transition-all shadow-[0_0_10px_rgba(255,77,0,0.1)]"
          >
            <div className="w-2 h-2 bg-[#ff4d00] rounded-full group-hover:animate-pulse shadow-[0_0_5px_#ff4d00]"></div>
            <span className="text-[#ff4d00] font-semibold">Agent Active</span>
          </button>

          <div className="w-[1px] h-6 bg-[#333] mx-2"></div>

          <button 
            onClick={() => window.open("http://localhost:7474", "_blank")} 
            className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/30 px-3 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
            HydraDB <ArrowUpRight className="w-3 h-3"/>
          </button>
          <button 
            onClick={() => window.open("http://localhost:9999", "_blank")} 
            className="text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 border border-transparent hover:border-purple-400/30 px-3 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400"></div>
            Hindsight <ArrowUpRight className="w-3 h-3"/>
          </button>
        </div>

      </nav>

      {/* AI Deal Risk Marquee */}
      <div className="bg-red-500/10 border-b border-red-500/20 py-2 px-8 overflow-hidden flex items-center mb-6">
        <span className="text-red-500 font-bold text-xs uppercase tracking-wider shrink-0 mr-4 flex items-center gap-2">
          <Zap className="w-3 h-3 animate-pulse" /> Agent Insights
        </span>
        <div className="whitespace-nowrap text-sm text-gray-300 font-medium transition-all duration-500 ease-in-out">
          {insights[insightIndex]}
        </div>
      </div>

      {/* Secondary Nav & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d00] to-[#ff8c00] border border-[#ff4d00]/50 shadow-[0_0_15px_rgba(255,77,0,0.3)]">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-medium">Multi-Agent Deal Swarm</h1>
            <p className="text-xs text-gray-400 mt-0.5">Coordinate your autonomous AI Agents to win competitive deals.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-[#0a0a0a] p-2 rounded-2xl border border-[#222]">
          <button 
            onClick={() => setActiveTab("pipeline")}
            className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (activeTab === "pipeline" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <Activity className="w-4 h-4" /> Monitor Agent
          </button>
          <button 
            onClick={() => setActiveTab("strategy")}
            className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (activeTab === "strategy" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <Bot className="w-4 h-4" /> Strategist Agent
          </button>
          <button 
            onClick={() => setActiveTab("briefing")}
            className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl " + (activeTab === "briefing" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <FileText className="w-4 h-4" /> Researcher Agent
          </button>
          <button 
            onClick={() => setActiveTab("battlecard")}
            className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl " + (activeTab === "battlecard" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <Trophy className="w-4 h-4" /> Intel Agent
          </button>
          <button 
            onClick={() => setActiveTab("email")}
            className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl " + (activeTab === "email" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <Send className="w-4 h-4" /> Outreach Agent
          </button>
          <button 
            onClick={() => setActiveTab("learning")}
            className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl " + (activeTab === "learning" ? "bg-[#ff4d00]/10 border border-[#ff4d00]/50 text-[#ff4d00]" : "border border-transparent text-gray-400 hover:text-white")}
          >
            <UploadCloud className="w-4 h-4" /> Memory Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8 mb-8">
        {/* Main Content Area (Dynamic based on tabs) */}
        <div className="lg:col-span-2">
          
          {activeTab === "pipeline" && (
            <div className="bg-[#110e0c] border border-[#ff4d00]/30 rounded-2xl p-8 relative overflow-hidden h-[600px] overflow-y-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff4d00]/10 to-transparent opacity-50"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#ff4d00]" /> Pipeline Monitor Agent
                </h2>
              </div>
              
              <div className="relative z-10 mb-8 bg-[#0a0a0a] border border-[#222] p-6 rounded-xl">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Historical Win/Loss vs Competitors (Last 90 Days)</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'TechNova', Won: 4, Lost: 3 },
                      { name: 'CloudSync', Won: 2, Lost: 5 },
                      { name: 'OmniCorp', Won: 6, Lost: 1 },
                      { name: 'GlobalNet', Won: 3, Lost: 2 },
                    ]}>
                      <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#1a1a1a'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Won" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                      <Bar dataKey="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Current Active Deals</h3>
                {/* Deal 1 */}
                <div className="bg-[#0a0a0a] border border-[#222] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Acme Corp</h3>
                    <p className="text-sm text-gray-400">Stage: Negotiation | Value: $120k</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 mb-1">Health Score</span>
                      <span className="text-emerald-500 font-bold text-lg">92%</span>
                    </div>
                    <button 
                      onClick={() => {
                        showToast("Agent analyzing Acme Corp deal...");
                        setTimeout(() => showToast("Drafting custom follow-up..."), 1500);
                        setTimeout(() => showToast("Sent! Saved to Salesforce."), 3000);
                      }}
                      className="px-4 py-2 bg-[#ff4d00]/10 border border-[#ff4d00]/50 hover:bg-[#ff4d00]/20 rounded-lg text-sm text-[#ff4d00] font-medium transition-colors flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" /> Agent: Fast-Track
                    </button>
                  </div>
                </div>

                {/* Deal 2 */}
                <div className="bg-[#0a0a0a] border border-[#222] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">TechNova Inc</h3>
                    <p className="text-sm text-gray-400">Stage: Discovery | Value: $45k</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 mb-1">Health Score</span>
                      <span className="text-yellow-500 font-bold text-lg">64%</span>
                    </div>
                    <button 
                      onClick={() => {
                        showToast("Agent scanning TechNova intent signals...");
                        setTimeout(() => showToast("Competitor pricing gap detected."), 1500);
                        setTimeout(() => showToast("Alerted AE via Slack with counter-offer."), 3000);
                      }}
                      className="px-4 py-2 bg-[#ff4d00]/10 border border-[#ff4d00]/50 hover:bg-[#ff4d00]/20 rounded-lg text-sm text-[#ff4d00] font-medium transition-colors flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" /> Agent: Rescue Deal
                    </button>
                  </div>
                </div>

                {/* Deal 3 */}
                <div className="bg-[#0a0a0a] border border-[#222] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">GlobalNet</h3>
                    <p className="text-sm text-gray-400">Stage: Proposal | Value: $250k</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 mb-1">Health Score</span>
                      <span className="text-red-500 font-bold text-lg">31%</span>
                    </div>
                    <button 
                      onClick={() => {
                        showToast("Agent evaluating At-Risk deal...");
                        setTimeout(() => showToast("Deal requires VP intervention."), 1500);
                        setTimeout(() => showToast("Drafted executive escalation email."), 3000);
                      }}
                      className="px-4 py-2 bg-[#ff4d00]/10 border border-[#ff4d00]/50 hover:bg-[#ff4d00]/20 rounded-lg text-sm text-[#ff4d00] font-medium transition-colors flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" /> Agent: Escalate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="bg-[#110e0c] border border-[#ff4d00]/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff4d00]/10 to-transparent opacity-50"></div>
              <h2 className="text-xl font-medium mb-6 relative z-10 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#ff4d00]" /> Outreach Agent
              </h2>
              <form onSubmit={runEmail} className="space-y-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm text-gray-400 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={emailAccountName}
                      onChange={(e) => setEmailAccountName(e.target.value)}
                      placeholder="e.g., GlobalNet"
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm"
                      required
                    />
                  </div>
                  <div className="w-full md:w-2/3">
                    <label className="block text-sm text-gray-400 mb-1">Reason for the Email</label>
                    <input
                      type="text"
                      value={emailReason}
                      onChange={(e) => setEmailReason(e.target.value)}
                      placeholder="e.g., Follow up on the latest demo, offer 20% discount"
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isEmailLoading}
                  className="bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] disabled:opacity-50"
                >
                  {isEmailLoading ? "Drafting..." : "Generate Email"}
                </button>
              </form>
              
              {emailResponse && (
                <div className="mt-8 bg-[#0a0a0a] border border-[#222] p-6 rounded-xl relative z-10">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => { showToast("Copied to clipboard!"); navigator.clipboard.writeText(emailResponse); }} className="text-xs bg-[#222] hover:bg-[#333] px-3 py-1 rounded transition-colors text-gray-300">Copy text</button>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{emailResponse}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4d00] to-[#ff8c00] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-medium">Strategist Agent</h2>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-[#0a0a0a] rounded-2xl border border-[#222] mb-4">
                {strategyHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Zap className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#ff4d00]" />
                    <p>Enter a competitor and a question below to strategize!</p>
                  </div>
                ) : (
                  strategyHistory.map((msg, idx) => (
                    <div key={idx} className={"flex gap-4 " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                      {msg.role === "agent" && (
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-[#ff4d00]/30 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-[#ff4d00]" />
                        </div>
                      )}
                      <div className={"p-4 rounded-2xl max-w-[80%] text-sm " + (msg.role === "user" ? "bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white rounded-br-none" : "bg-[#111] border border-[#222] text-gray-300 rounded-bl-none")}>
                        {msg.role === "agent" ? (
                          <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isStrategyLoading && (
                   <div className="flex gap-4 justify-start">
                     <div className="w-8 h-8 rounded-full bg-[#111] border border-[#ff4d00]/30 flex items-center justify-center shrink-0">
                       <Bot className="w-4 h-4 text-[#ff4d00]" />
                     </div>
                     <div className="p-4 rounded-2xl bg-[#111] border border-[#222] rounded-bl-none flex gap-1.5 items-center">
                       <div className="w-2 h-2 bg-[#ff4d00] rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-[#ff4d00] rounded-full animate-bounce delay-100"></div>
                       <div className="w-2 h-2 bg-[#ff4d00] rounded-full animate-bounce delay-200"></div>
                     </div>
                   </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={runStrategy} className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={competitor}
                    onChange={(e) => setCompetitor(e.target.value)}
                    placeholder="Competitor"
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 transition-colors text-sm"
                    required
                  />
                </div>
                <div className="col-span-3 relative">
                  <input
                    type="text"
                    value={strategyQuestion}
                    onChange={(e) => setStrategyQuestion(e.target.value)}
                    placeholder="How do we win this deal?"
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-4 pr-12 py-3 outline-none focus:border-[#ff4d00]/50 transition-colors text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isStrategyLoading}
                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "briefing" && (
            <div className="bg-[#110e0c] border border-[#ff4d00]/30 rounded-2xl p-8 relative overflow-hidden h-[800px] overflow-y-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff4d00]/10 to-transparent opacity-50"></div>
              <h2 className="text-xl font-medium mb-6 relative z-10 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff4d00]" /> Account Briefing
              </h2>
              <form onSubmit={runBriefing} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="w-full max-w-md bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBriefingLoading}
                  className="bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] disabled:opacity-50"
                >
                  {isBriefingLoading ? "Generating..." : "Generate Brief"}
                </button>
              </form>
              
              {briefingResponse && (
                <div className="space-y-6 relative z-10 mt-8">
                  {/* Visualizations Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Engagement Velocity (L6M)</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { month: 'Jan', interactions: 4 },
                            { month: 'Feb', interactions: 7 },
                            { month: 'Mar', interactions: 5 },
                            { month: 'Apr', interactions: 12 },
                            { month: 'May', interactions: 18 },
                            { month: 'Jun', interactions: 24 },
                          ]}>
                            <XAxis dataKey="month" stroke="#333" tick={{fill: '#888', fontSize: 11}} />
                            <YAxis stroke="#333" tick={{fill: '#888', fontSize: 11}} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="interactions" stroke="#ff4d00" strokeWidth={3} dot={{ fill: '#ff4d00', strokeWidth: 2 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Key Discussion Topics</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Pricing', value: 35 },
                                { name: 'Integration', value: 25 },
                                { name: 'Security', value: 20 },
                                { name: 'Support', value: 20 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#ff4d00" />
                              <Cell fill="#3b82f6" />
                              <Cell fill="#10b981" />
                              <Cell fill="#8b5cf6" />
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                            <Legend wrapperStyle={{fontSize: '12px'}} verticalAlign="bottom" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#222] p-8 rounded-xl">
                    <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{briefingResponse}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "battlecard" && (
             <div className="bg-[#110e0c] border border-[#ff4d00]/30 rounded-2xl p-8 relative overflow-hidden h-[800px] overflow-y-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff4d00]/10 to-transparent opacity-50"></div>
              <h2 className="text-xl font-medium mb-6 relative z-10 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ff4d00]" /> Competitor Battlecard
              </h2>
              <form onSubmit={runBattlecard} className="space-y-4 relative z-10 mb-8">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Competitor Name</label>
                  <input
                    type="text"
                    value={battlecardCompetitor}
                    onChange={(e) => setBattlecardCompetitor(e.target.value)}
                    placeholder="e.g., TechNova"
                    className="w-full max-w-md bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBattlecardLoading}
                  className="bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] disabled:opacity-50"
                >
                  {isBattlecardLoading ? "Generating..." : "Generate Battlecard"}
                </button>
              </form>
              
              {battlecardResponse && (
                <div className="space-y-6 relative z-10">
                  {/* Visualizations Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Feature Capability Analysis</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                            { subject: 'Security', Us: 95, Them: 70, fullMark: 100 },
                            { subject: 'Pricing', Us: 70, Them: 90, fullMark: 100 },
                            { subject: 'Support', Us: 100, Them: 40, fullMark: 100 },
                            { subject: 'Integrations', Us: 85, Them: 60, fullMark: 100 },
                            { subject: 'Scalability', Us: 90, Them: 65, fullMark: 100 },
                          ]}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{fill: '#888', fontSize: 11}} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Our Platform" dataKey="Us" stroke="#ff4d00" fill="#ff4d00" fillOpacity={0.4} />
                            <Radar name={battlecardCompetitor || "Competitor"} dataKey="Them" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                            <Legend wrapperStyle={{fontSize: '12px'}} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Scatter Plot */}
                    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl flex flex-col justify-between">
                      <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Market Positioning</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: -20 }}>
                            <XAxis type="number" dataKey="price" name="Price" tick={{fill: '#888', fontSize: 11}} stroke="#333" domain={[0, 100]} label={{ value: 'Price (Lower is Better)', position: 'bottom', offset: 0, fill: '#666', fontSize: 11 }} />
                            <YAxis type="number" dataKey="performance" name="Performance" tick={{fill: '#888', fontSize: 11}} stroke="#333" domain={[0, 100]} label={{ value: 'Performance', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 11 }} />
                            <ZAxis type="number" range={[100, 400]} />
                            <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} verticalAlign="bottom" />
                            <Scatter name="Our Platform" data={[{ price: 40, performance: 90 }]} fill="#ff4d00" />
                            <Scatter name={battlecardCompetitor || "Competitor"} data={[{ price: 20, performance: 60 }]} fill="#3b82f6" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Text Markdown */}
                  <div className="bg-[#0a0a0a] border border-[#222] p-8 rounded-xl">
                    <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{battlecardResponse}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "learning" && (
             <div className="bg-[#110e0c] border border-[#ff4d00]/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff4d00]/10 to-transparent opacity-50"></div>
              <h2 className="text-xl font-medium mb-6 relative z-10 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#ff4d00]" /> Memory Ingestion Agent
              </h2>
              <form onSubmit={runLearning} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Deal ID</label>
                  <input
                    type="text"
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                    placeholder="e.g., D106"
                    className="w-full max-w-md bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-gray-400">Call Notes / Transcript</label>
                    <button 
                      type="button"
                      onClick={() => {
                        showToast("Uploading and transcribing audio...");
                        setTimeout(() => {
                          setNotes("Transcript from Call_Recording_Acme_001.mp3:\n\nRep: Hi, thanks for joining.\nClient: Yes, our biggest concern is security compliance.\nRep: We have SOC2 Type II.\nClient: Great, we want to proceed. We will evaluate TechNova as well though.");
                          showToast("Transcription complete!");
                        }, 2500);
                      }}
                      className="text-xs bg-[#111] hover:bg-[#222] border border-[#333] px-3 py-1 rounded-full text-[#ff4d00] transition-colors flex items-center gap-1"
                    >
                      <UploadCloud className="w-3 h-3"/> Upload Call Audio (MP3)
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Client asked about compliance..."
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 outline-none focus:border-[#ff4d00]/50 text-sm min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Agent Extraction Goals</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={extractCompetitors} onChange={(e) => setExtractCompetitors(e.target.checked)} className="accent-[#ff4d00]" />
                      Detect Competitors
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={extractPainPoints} onChange={(e) => setExtractPainPoints(e.target.checked)} className="accent-[#ff4d00]" />
                      Extract Pain Points
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={extractActionItems} onChange={(e) => setExtractActionItems(e.target.checked)} className="accent-[#ff4d00]" />
                      Identify Action Items
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLearningLoading}
                  className="bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] disabled:opacity-50"
                >
                  {isLearningLoading ? "Ingesting..." : "Ingest to Agent Memory"}
                </button>
              </form>
              
              {learningStatus && (
                <div className={"mt-8 border p-6 rounded-xl relative z-10 " + (learningStatus.includes("Error") ? "bg-[#0a0a0a] border-red-500/30 text-red-400" : "bg-[#0a0a0a] border-emerald-500/30")}>
                  <h3 className={"font-medium mb-3 flex items-center gap-2 " + (learningStatus.includes("Error") ? "text-red-500" : "text-emerald-500")}>
                    {!learningStatus.includes("Error") && <CheckCircle2 className="w-4 h-4" />} {learningStatus}
                  </h3>
                  {!learningStatus.includes("Error") && (
                    <div className="font-mono text-xs text-gray-400 whitespace-pre-wrap leading-loose mt-4 bg-[#111] p-4 rounded-lg">
                      {"> Analyzing transcript using NLP..." + "\n" +
                       (extractCompetitors ? "> Extracted Node: Competitor (TechNova)\n" : "") +
                       (extractPainPoints ? "> Extracted Node: Pain Point (Security Compliance)\n" : "") +
                       (extractActionItems ? "> Extracted Node: Action Item (Send SOC2 Report)\n" : "") +
                       "> Knowledge Graph Updated Successfully."}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 pt-12">
          
          {/* Agent Memory Stats */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Knowledge Graph</h3>
              <Activity className="w-4 h-4 text-[#ff4d00]" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> 5 Deals
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00] text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-[#ff4d00]"></div> 3 Comps
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> 4 Products
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-500 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> 5 Features
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div> 22 Transcripts
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              HydraDB nodes and Hindsight vector embeddings are fully synced and ready to be queried by the Agent.
            </p>
          </div>

          {/* Quick Action */}
          <div className="bg-gradient-to-br from-[#8a1c1c] via-[#bd3c14] to-[#e67e22] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="text-xl font-medium text-white mb-2 relative z-10">HydraDB Graph</h3>
            <p className="text-sm text-white/80 mb-6 leading-relaxed relative z-10">
              Visualize the Knowledge Graph containing your reps, deals, and competitors.
            </p>
            <button onClick={() => window.open("http://localhost:7474", "_blank")} className="w-full py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium mb-3 transition-colors relative z-10 flex justify-center items-center gap-2">
              Open Graph Visualizer <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-white/60 relative z-10">
              Runs locally on bolt://localhost:7687
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-12">
        
        {/* Top Sales Reps */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top Sales Reps</h3>
            <button 
              onClick={() => setShowAllReps(!showAllReps)}
              className="px-4 py-1.5 rounded-full border border-[#333] text-xs text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
            >
              {showAllReps ? "View Less" : "View All"}
            </button>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden transition-all duration-300">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#111] border-b border-[#222]">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Rep Name</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue (Q3)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#1</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">A</div>
                      <span className="text-gray-300">Alice (Enterprise)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-medium">$300,000</td>
                </tr>
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#2</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#ff4d00] flex items-center justify-center text-white text-[10px]">B</div>
                      <span className="text-gray-300">Bob (SMB)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white">$120,000</td>
                </tr>
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#3</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">C</div>
                      <span className="text-gray-300">Charlie (Mid-Market)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white">$80,000</td>
                </tr>
                
                {showAllReps && (
                  <>
                    <tr className="hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4">#4</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px]">D</div>
                          <span className="text-gray-300">David (SMB)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-white">$65,000</td>
                    </tr>
                    <tr className="hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4">#5</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-[10px]">E</div>
                          <span className="text-gray-300">Eve (Enterprise)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-white">$45,000</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Top Products by Win Rate</h3>
            <button 
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="px-4 py-1.5 rounded-full border border-[#333] text-xs text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
            >
              {showAllProducts ? "View Less" : "View All"}
            </button>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden transition-all duration-300">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#111] border-b border-[#222]">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Product Line</th>
                  <th className="px-6 py-4 font-medium text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#1</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Analytics Suite</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">Data</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-medium">100%</td>
                </tr>
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#2</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Enterprise Cloud</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#ff4d00]/20 text-[#ff4d00] font-medium">Infrastructure</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-yellow-500">66%</td>
                </tr>
                <tr className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">#3</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Core Platform</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-medium">SaaS</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-red-500">0%</td>
                </tr>
                
                {showAllProducts && (
                  <>
                    <tr className="hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4">#4</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">Mobile API</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 font-medium">DevTools</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-red-500">0%</td>
                    </tr>
                    <tr className="hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4">#5</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">Security Guard</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 font-medium">Security</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-red-500">0%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toasts (Top Center Pill) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-[#111]/90 backdrop-blur-md border border-[#333] text-gray-200 px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] animate-pulse"></div>
            <p className="text-sm">{toast.msg}</p>
          </div>
        ))}
      </div>

      {/* Live Agent Trace */}
      {isTraceVisible && (
        <div className="fixed bottom-6 left-6 z-50 w-96 bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl overflow-hidden font-mono text-xs text-gray-400">
          <div className="bg-[#111] px-4 py-2 border-b border-[#333] flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#ff4d00]" />
            <span className="font-medium text-gray-300">Agent Brain Trace</span>
            <div className="ml-auto flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-1.5 h-48 overflow-y-auto">
            {agentTrace.map((log, idx) => {
              if (!log) return null;
              return (
                <div key={idx} className={log.includes("MATCH") ? "text-[#ff4d00]" : ""}>
                  {log}
                </div>
              );
            })}
            <div className="flex gap-1 items-center text-[#ff4d00] mt-1">
              <div className="w-1.5 h-3 bg-[#ff4d00] animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
