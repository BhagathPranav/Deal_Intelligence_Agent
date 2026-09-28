"use client";

import { useState } from "react";
import { MessageSquare, FileText, UploadCloud, Search, Send, CheckCircle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("strategy");

  // Strategy State
  const [strategyQuestion, setStrategyQuestion] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [strategyResponse, setStrategyResponse] = useState("");
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  // Briefing State
  const [accountName, setAccountName] = useState("");
  const [briefingResponse, setBriefingResponse] = useState("");
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Learning State
  const [dealId, setDealId] = useState("");
  const [notes, setNotes] = useState("");
  const [learningStatus, setLearningStatus] = useState("");
  const [isLearningLoading, setIsLearningLoading] = useState(false);

  const runStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStrategyLoading(true);
    setStrategyResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "strategy",
          payload: { question: strategyQuestion, competitor }
        })
      });
      const data = await res.json();
      setStrategyResponse(data.data?.output || JSON.stringify(data.data) || "No response received.");
    } catch (err: any) {
      setStrategyResponse("Error: " + err.message);
    }
    setIsStrategyLoading(false);
  };

  const runBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBriefingLoading(true);
    setBriefingResponse("");
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
      } else {
        setLearningStatus("Error: " + data.error);
      }
    } catch (err: any) {
      setLearningStatus("Error: " + err.message);
    }
    setIsLearningLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-indigo-600 text-white shadow-lg p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6" />
            Deal Intelligence Agent
          </h1>
          <p className="text-indigo-200 text-sm font-medium">Powered by Hindsight + HydraDB + RocketRide</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("strategy")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "strategy" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}
          >
            <MessageSquare className="w-5 h-5" />
            Strategy Advisor
          </button>
          <button
            onClick={() => setActiveTab("briefing")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "briefing" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}
          >
            <FileText className="w-5 h-5" />
            Account Briefing
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "learning" ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}
          >
            <UploadCloud className="w-5 h-5" />
            Ingest Notes
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          
          {/* Strategy Tab */}
          {activeTab === "strategy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Strategy Advisor</h2>
                <p className="text-gray-500 text-sm">Ask for strategic advice to win an active deal against a competitor.</p>
              </div>
              <form onSubmit={runStrategy} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Competitor Name</label>
                    <input
                      type="text"
                      value={competitor}
                      onChange={(e) => setCompetitor(e.target.value)}
                      placeholder="e.g., TechNova"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                    <input
                      type="text"
                      value={strategyQuestion}
                      onChange={(e) => setStrategyQuestion(e.target.value)}
                      placeholder="How do we counter their pricing?"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isStrategyLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isStrategyLoading ? "Thinking..." : "Ask Agent"}
                </button>
              </form>

              {strategyResponse && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                  <h3 className="font-medium text-gray-800 mb-2">Agent Response:</h3>
                  <p className="text-gray-600">{strategyResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Briefing Tab */}
          {activeTab === "briefing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Account Briefing</h2>
                <p className="text-gray-500 text-sm">Generate a pre-call reflection on an account.</p>
              </div>
              <form onSubmit={runBriefing} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 max-w-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBriefingLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  {isBriefingLoading ? "Generating..." : "Generate Brief"}
                </button>
              </form>

              {briefingResponse && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                  <h3 className="font-medium text-gray-800 mb-2">Account Briefing:</h3>
                  <p className="text-gray-600">{briefingResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === "learning" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Ingest Call Notes</h2>
                <p className="text-gray-500 text-sm">Save your post-call notes so the agent can learn for future deals.</p>
              </div>
              <form onSubmit={runLearning} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal ID</label>
                  <input
                    type="text"
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                    placeholder="e.g., D106"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 max-w-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call Notes / Transcript</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Client asked about compliance. We mentioned SOC2..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLearningLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  {isLearningLoading ? "Saving..." : "Save Notes"}
                </button>
              </form>

              {learningStatus && (
                <div className={`mt-6 p-4 rounded-lg border flex items-center gap-2 ${learningStatus.includes("Error") ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                  {!learningStatus.includes("Error") && <CheckCircle className="w-5 h-5" />}
                  <p className="font-medium">{learningStatus}</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
