"use server";

import { getCorsairWithTenant } from "./getInbox";

export async function searchMessages() {
  const client = await getCorsairWithTenant();
  return await client.gmail.db.messages.search({
    data: {
      from: {
        contains: "springboard@infosys.com",
      },
    },
    limit: 20,
    offset: 0,
  });
}
