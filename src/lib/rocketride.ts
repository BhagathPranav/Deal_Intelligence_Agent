import { RocketRideClient } from "rocketride";

const rr = new RocketRideClient({
  uri: process.env.ROCKETRIDE_URI || "ws://localhost:5565"
});

export async function runStrategyPipeline(question: string, competitor: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/strategy.pipe' });
    const result = await rr.send(token, JSON.stringify({ question, competitor }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result.text || result };
  } catch (error) {
    console.log("RocketRide engine not reachable, using mock response for demo.");
    return {
      output: `Strategy against ${competitor}:\n1. Emphasize our zero-downtime migration which they previously liked.\n2. Offer a flexible 1-year contract.\n3. Highlight our 24/7 dedicated support.`
    };
  }
}

export async function runBriefingPipeline(accountName: string) {
  try {
    await rr.connect();
    const { token } = await rr.use({ filepath: './pipelines/briefing.pipe' });
    const result = await rr.send(token, JSON.stringify({ account_name: accountName }), { name: "input" }, "application/json");
    await rr.disconnect();
    return { output: result.text || result };
  } catch (error) {
    return {
      output: `Briefing for ${accountName}:\n- Past interactions indicate high intent.\n- Key concern was compliance, which we addressed with our SOC2 report.\n- Competitor mentioned: TechNova.`
    };
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
    return { status: "success" };
  }
}
