import dotenv from "dotenv";
dotenv.config();

import { corsair } from "@/server/corsair";
async function test() {
  const client = corsair.withTenant("default");
  const labels = await client.gmail.api.labels.list({});
  console.log("✅ Labels:", JSON.stringify(labels, null, 2));
}

test().catch((error) => {
  console.log("❌ Error:", error);
  process.exit(1);
});
