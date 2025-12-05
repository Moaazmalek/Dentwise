import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    console.log("Thrown Error")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    assistantId: process.env.VAPI_ASSISTANT_ID
  });
}
