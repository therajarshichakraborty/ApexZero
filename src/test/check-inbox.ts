import "dotenv/config"
import { corsair } from '../server/corsair';

async function test() {
    const client = corsair.withTenant("default");
    const messages = await client.gmail.api.messages.list({
        labelIds: ['INBOX'],
        maxResults: 5,
    });
    console.log('✅ Inbox messages:', JSON.stringify(messages, null, 2));
}

test().catch(console.error);

import dotenv from "dotenv"
dotenv.config()

// import { corsair } from '@/server/corsair';

// async function test() {
//     const client = corsair.withTenant("default");
//     const messages = await client.gmail.api.messages.list({
//         labelIds: ['INBOX'],
//         maxResults: 5,
//     });
//     console.log('✅ Inbox messages:', JSON.stringify(messages, null, 2));
// }

// test().catch(console.error);