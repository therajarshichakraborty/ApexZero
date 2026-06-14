import { NextRequest } from "next/server";
import { auth } from "@/utils/auth"
export async function getSessionTenantId(request: NextRequest): Promise<string | null> {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user?.id) {
        return null;
    }

    // Use the user's ID as the tenant ID so tokens are scoped per user
    return session.user.id;
}