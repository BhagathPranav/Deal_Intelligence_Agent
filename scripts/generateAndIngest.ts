import { Groq } from "groq-sdk";
import neo4j from "neo4j-driver";
import { HindsightClient } from "@vectorize-io/hindsight-client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const hindsight = new HindsightClient({ baseUrl: process.env.HINDSIGHT_API_URL || "http://localhost:8888" });

// Connect to HydraDB
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.bearer("local-development-token-32-bytes")
);

async function generateDeals() {
  console.log("Using synthetic deals...");
  return [
    {
      "dealId": "D101",
      "account": "Acme Corp",
      "rep": "Alice",
      "competitor": "TechNova",
      "amount": 50000,
      "stage": "Closed Won",
      "callTranscript": "Client was concerned about security. We assured them with our SOC2 report. They compared us to TechNova, but our SSO integration won them over."
    },
    {
      "dealId": "D102",
      "account": "Globex",
      "rep": "Bob",
      "competitor": "CloudSync",
      "amount": 120000,
      "stage": "Closed Lost",
      "callTranscript": "They liked our UI but CloudSync offered a 20% discount on their enterprise tier. We couldn't match the pricing. We should highlight our ROI earlier next time."
    },
    {
      "dealId": "D103",
      "account": "Initech",
      "rep": "Charlie",
      "competitor": "TechNova",
      "amount": 80000,
      "stage": "Closed Won",
      "callTranscript": "TechNova tried to lock them into a 3-year contract. We offered a 1-year flexible term which sealed the deal. Also emphasized our 24/7 support."
    },
    {
      "dealId": "D104",
      "account": "Stark Industries",
      "rep": "Alice",
      "competitor": "OmniCorp",
      "amount": 250000,
      "stage": "Closed Won",
      "callTranscript": "Complex technical evaluation. They worried about migration downtime. Our custom migration script (zero downtime) beat OmniCorp's manual approach."
    },
    {
      "dealId": "D105",
      "account": "Wayne Enterprises",
      "rep": "Bob",
      "competitor": "TechNova",
      "amount": 150000,
      "stage": "Closed Lost",
      "callTranscript": "Stakeholder change mid-deal. The new CTO had a pre-existing relationship with TechNova. We need better multi-threading in large accounts."
    }
  ];
}

async function ingestToHydraDB(deals: any[]) {
  console.log("Ingesting structured data to HydraDB...");
  const session = driver.session();
  try {
    for (const deal of deals) {
      const dealId = parseInt(deal.dealId.replace('D', ''));
      await session.run(`CREATE (:Rep {id: ${dealId + 1000}, name: "${deal.rep}"})-[:WORKED_ON]->(:Deal {id: ${dealId}})`);
      await session.run(`CREATE (:Deal {id: ${dealId}})-[:BELONGS_TO]->(:Account {id: ${dealId + 2000}, name: "${deal.account}"})`);
      await session.run(`CREATE (:Deal {id: ${dealId}})-[:COMPETED_AGAINST]->(:Competitor {id: ${dealId + 3000}, name: "${deal.competitor}"})`);
      console.log(`Ingested structured deal: ${deal.dealId}`);
    }
  } finally {
    await session.close();
  }
}

async function ingestToHindsight(deals: any[]) {
  console.log("Ingesting unstructured memories to Hindsight...");
  const bankId = "deal-intelligence";
  for (const deal of deals) {
    const memory = `Deal ${deal.dealId} at ${deal.account} by ${deal.rep}: ${deal.callTranscript}`;
    await hindsight.retain(bankId, memory);
    console.log(`Ingested memory for deal: ${deal.dealId}`);
  }
}

async function main() {
  try {
    const deals = await generateDeals();
    if (!deals || deals.length === 0) {
      throw new Error("No deals generated");
    }
    console.log(`Generated ${deals.length} deals`);
    
    await ingestToHydraDB(deals);
    await ingestToHindsight(deals);

    console.log("Phase 2 Dual-Ingestion complete!");
  } catch (error) {
    console.error("Error during ingestion:", error);
  } finally {
    await driver.close();
  }
}

main();
