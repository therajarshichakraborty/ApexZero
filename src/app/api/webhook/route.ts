import { processWebhook } from "corsair";
import { corsair } from "@/server/corsair";

export async function POST(request: Request) {
    const headers = Object.fromEntries(request.headers);
    const body = await request.json();
    const result = await processWebhook(corsair, headers, body);
    return result.response;
}