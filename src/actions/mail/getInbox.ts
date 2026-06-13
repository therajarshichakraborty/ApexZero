"use server"

import { corsair } from "../../../corsair"


export async function getInbox() {
return await corsair.gmail.db.messages.list();
}