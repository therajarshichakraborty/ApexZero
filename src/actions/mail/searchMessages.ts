"use server";

import { corsair } from "../../../corsair";

export async function searchMessages(query: string) {
    return await corsair.gmail.db.messages.search({
        data: {
            subject: {
                contains: query,
            },
        },
        limit: 20,
    });
}