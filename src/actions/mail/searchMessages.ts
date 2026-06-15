"use server";
import { getCorsairWithTenant } from "@/server/corsair";

export async function searchMessages() {
  const client = await getCorsairWithTenant();
  return await client.gmail.db.messages.search({
    data: {
      from: {
        contains: "[EMAIL_ADDRESS]",
      },
    },
    limit: 20,
    offset: 0,
  });
}
