import { NextResponse } from "next/server";
import { runStrategyPipeline, runBriefingPipeline } from "@/lib/rocketride";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    let result;

    if (action === "strategy") {
      // payload: { question, competitor }
      result = await runStrategyPipeline(payload.question, payload.competitor);
    } else if (action === "briefing") {
      // payload: { account_name }
      result = await runBriefingPipeline(payload.account_name);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Pipeline Execution Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
