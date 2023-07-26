import { json } from "@sveltejs/kit"
import * as api from "$lib/api.server"

export async function GET() {
	const result = await api.getLatestThreads()

	return json(result)
}
