import { NextResponse } from "next/server";
import { runLearningPipeline } from "@/lib/rocketride";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealId, notes } = body;

    if (!dealId || !notes) {
      return NextResponse.json({ error: "Missing dealId or notes" }, { status: 400 });
    }

    const result = await runLearningPipeline(dealId, notes);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Ingestion Pipeline Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
