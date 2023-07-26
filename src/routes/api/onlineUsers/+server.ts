import { json } from "@sveltejs/kit"
import * as api from '$lib/api'

export async function GET() {
    const result = await api.getOnlineUsers()

    return json(result)
}