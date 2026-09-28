# 🚀 Nexus Agent Swarm (Deal Intelligence Agent)

> **Winner/Submission for the AIO Hackathon with HYD!**

Nexus Agent Swarm is a next-generation autonomous multi-agent platform designed to rescue, accelerate, and win competitive sales deals. Instead of a traditional CRM, Nexus operates as a swarm of AI agents that actively monitor your pipeline, ingest call transcripts, build knowledge graphs, and take autonomous actions.

## 🌟 Key Features (Agent Swarm)

- **📈 Monitor Agent**: Real-time pipeline observability. Analyzes win/loss ratios against competitors using Recharts visualizations.
- **🧠 Strategist Agent**: Runs deep Neo4j Cypher queries against the Knowledge Graph to build battlecards, compare features, and identify missing capabilities.
- **🕵️ Researcher Agent**: Analyzes historical call transcripts to generate Account Briefings, Engagement Velocity (Line Charts), and Key Discussion Topics (Donut Charts).
- **📊 Intel Agent**: Provides deep market positioning using Scatter Plots and Radar Charts to visualize feature capabilities vs competitors.
- **📧 Outreach Agent**: Drafts highly personalized, context-aware emails based on specific deal reasons and historical context.
- **💾 Memory Agent (Ingestion)**: Processes raw call audio (MP3/transcripts), extracts Action Items, Pain Points, and Competitors, and natively syncs them to the Knowledge Graph.

## 🏗️ Architecture

- **Frontend**: Next.js 14, TailwindCSS, Lucide Icons, Recharts for analytics.
- **Backend**: Next.js API Routes.
- **AI Engine**: Groq (`openai/gpt-oss-120b`) fallback layer with structured JSON output.
- **Memory & Knowledge Graph**: 
  - We leverage [Vectorize agent memory](https://vectorize.io/what-is-agent-memory) powered by [Hindsight](https://github.com/vectorize-io/hindsight) to give our agents persistent, long-term memory across deal cycles.
  - See the [Hindsight docs](https://hindsight.vectorize.io/) for how we integrated Neo4j (HydraDB) vector embeddings.
- **Orchestration**: RocketRide C++ engine (with robust Node.js fallbacks).

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Ensure you have your `.env.local` configured:
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```

3. **Run the Dashboard**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the Agent Swarm.

## 💡 Hackathon Highlights
- Fully responsive dark-mode UI with glowing interactive components.
- Live Terminal Trace overlays showing real-time backend agent thought processes.
- Autonomous Action Buttons ("Rescue Deal", "Escalate") simulating real-time Slack/Salesforce API integrations.
