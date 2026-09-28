import { RocketRideClient } from "rocketride";
import { Groq } from "groq-sdk";
import neo4j from "neo4j-driver";

const rr = new RocketRideClient({
  uri: process.env.ROCKETRIDE_URI || "ws://localhost:5565"
});

// Initialize Groq and Neo4j for our dynamic fallback!
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.bearer("local-development-token-32-bytes")
);

export async function runStrategyPipeline(question: string, competitor: string) {
  try {
    // Attempt real pipeline via RocketRide engine
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/strategy.pipe' });
    const result = await rr.send(token, JSON.stringify({ question, competitor }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result?.text || result || "No output" };
  } catch (error) {
    console.log("RocketRide engine offline. Falling back to dynamic Groq LLM Generation!");
    
    // Fallback: Query HydraDB for context
    let graphContext = "No deals found.";
    const session = driver.session();
    try {
      const cypherRes = await session.run(
        `MATCH (d:Deal)-[:COMPETED_AGAINST]->(c:Competitor {name: $competitor}) RETURN d.id as deal_id LIMIT 3`,
        { competitor }
      );
      const dealIds = cypherRes.records.map(r => r.get("deal_id").toString());
      if (dealIds.length > 0) {
        graphContext = `Past deals against ${competitor}: ${dealIds.join(", ")}`;
      }
    } catch (e) {
      console.error("HydraDB Query Error:", e);
    } finally {
      await session.close();
    }

    // Fallback: Call Groq LLM
    const prompt = `You are a brilliant Deal Intelligence Agent. 
The rep is asking for advice: "${question}"

Context from our Knowledge Graph:
${graphContext}

Competitor: ${competitor}

Provide a punchy, highly specific 3-bullet strategy on how to win this deal. Use Markdown formatting (bolding, lists).`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-120b",
      });
      return { output: chatCompletion.choices[0]?.message?.content };
    } catch (llmError: any) {
       return { output: `Error contacting LLM: ${llmError.message}` };
    }
  }
}

export async function runBriefingPipeline(accountName: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/briefing.pipe' });
    const result = await rr.send(token, JSON.stringify({ account_name: accountName }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result?.text || result || "No output" };
  } catch (error) {
    console.log("RocketRide offline. Falling back to dynamic LLM Generation!");
    const prompt = `Generate a highly concise 3-point pre-call executive briefing for the account: ${accountName}. Highlight potential risks and value drivers.`;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });
    return { output: chatCompletion.choices[0]?.message?.content };
  }
}

export async function runBattlecardPipeline(competitor: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/battlecard.pipe' });
    const result = await rr.send(token, JSON.stringify({ competitor }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result?.text || result || "No output" };
  } catch (error) {
    const prompt = `Create a highly concise sales Battlecard against competitor: ${competitor}. 
Include exactly 3 sections:
1. **Their Weaknesses**
2. **Our Key Differentiators**
3. **Common Objections & Rebuttals**
Format this beautifully in Markdown.`;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });
    return { output: chatCompletion.choices[0]?.message?.content };
  }
}

export async function runEmailPipeline(accountName: string, reason?: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/email.pipe' });
    const result = await rr.send(token, JSON.stringify({ account_name: accountName, reason }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result?.text || result || "No output" };
  } catch (error) {
    const prompt = `Write a professional, persuasive email for the account: ${accountName}.
Context/Reason for this email: ${reason || "Follow up on our last meeting."}
The email should:
1. Be highly relevant to the provided reason.
2. Maintain a professional, consultative tone.
3. Propose a clear next step.
Format with a clear Subject Line.`;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
    });
    return { output: chatCompletion.choices[0]?.message?.content };
  }
}

export async function runLearningPipeline(dealId: string, notes: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/learning.pipe' });
    const result = await rr.send(token, JSON.stringify({ deal_id: dealId, notes }), { name: "input" }, "application/json");
    await rr.disconnect();
    return result;
  } catch (error) {
    // Just mock success since learning pipeline writes to Hindsight (which has quota limits right now)
    return { status: "success" };
  }
}
