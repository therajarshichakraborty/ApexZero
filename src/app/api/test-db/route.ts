import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const start = Date.now();

  await db.execute(sql`select 1`);

  return NextResponse.json({
    ms: Date.now() - start,
  });
}
