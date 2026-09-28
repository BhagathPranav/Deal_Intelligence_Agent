import { NextResponse } from "next/server";
import { runStrategyPipeline, runBriefingPipeline, runBattlecardPipeline } from "@/lib/rocketride";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    let result;

    if (action === "strategy") {
      result = await runStrategyPipeline(payload.question, payload.competitor);
    } else if (action === "briefing") {
      result = await runBriefingPipeline(payload.account_name);
    } else if (action === "battlecard") {
      result = await runBattlecardPipeline(payload.competitor);
    } else if (action === "email") {
      const { runEmailPipeline } = await import("@/lib/rocketride");
      result = await runEmailPipeline(payload.account_name, payload.reason);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Pipeline Execution Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
