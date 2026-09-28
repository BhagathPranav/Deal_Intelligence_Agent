# Deal Intelligence Agent 🚀

A powerful AI assistant for B2B sales teams that leverages past deals, competitor intelligence, and call transcripts to provide winning strategies in real-time.

Built for **HackWithHyderabad 3.0**, this project demonstrates a state-of-the-art dual-memory architecture orchestrated by advanced visual AI pipelines.

## 🏗️ Architecture & Technologies

This project strictly adheres to the Hackathon Agent Skills requirements, utilizing three core technologies:

1. **HydraDB (Knowledge Graph)**
   - Acts as the structured memory layer.
   - Stores entities (Reps, Accounts, Deals, Competitors) and their relationships.
   - Enables the agent to query structured history (e.g., "Which deals did we lose against TechNova?").

2. **Hindsight (Semantic Memory)**
   - Acts as the unstructured memory layer.
   - Ingests and parses raw call transcripts, post-call notes, and objection handling history.
   - Uses \`reflect\` and \`retain\` operations to fetch deep semantic context during active deal strategy generation.

3. **RocketRide (AI Pipeline Orchestration)**
   - Powers the logic layer.
   - We designed 3 distinct visual pipelines (located in \`/pipelines\`):
     - \`strategy.pipe\`: Combines HydraDB graph lookups with Hindsight semantic recalls to feed Groq LLM context for real-time deal strategy.
     - \`briefing.pipe\`: Generates pre-call account summaries.
     - \`learning.pipe\`: Ingests new call notes back into Hindsight.

4. **Next.js & Tailwind CSS**
   - Provides a sleek, responsive dashboard for Sales Reps to interact with the agent.

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Groq API Key

### 2. Infrastructure Setup
Boot up the dual-memory architecture (HydraDB and Hindsight):
\`\`\`bash
docker compose up -d
\`\`\`
- Hindsight API runs on \`localhost:8888\` (UI on \`9999\`)
- HydraDB runs on \`bolt://localhost:7687\`

### 3. Data Ingestion
Populate the databases with synthetic B2B sales data:
\`\`\`bash
cd deal-intelligence-agent
npm install
npx tsx scripts/generateAndIngest.ts
\`\`\`

### 4. Run the Web App
Start the Next.js UI:
\`\`\`bash
npm run dev
\`\`\`
Navigate to \`http://localhost:3000\`.

## 🧠 How it Works
1. **Ingest Notes:** A rep finishes a call and pastes their notes into the UI. The \`learning.pipe\` stores this unstructured data in Hindsight.
2. **Strategy Generation:** Another rep is facing a competitor. They ask the agent for advice. The \`strategy.pipe\` queries HydraDB to find past deals against that competitor, pulls the relevant call notes from Hindsight, and uses a Groq LLM to synthesize a 3-bullet winning strategy.

## 📜 License
MIT
