import { json, type RequestEvent } from "@sveltejs/kit"
import * as api from "$lib/api.server.js"

export async function GET({ request }: any) {
	let id: string = request.url.replace(
		"http://localhost:5173/api/threadData/",
		""
	)
	const result = await api.fetchThreadData(id)

	console.log(`\\${result.content}\\`)

	// if (result.author.uid == "") {
		// return json("Thread does not exist")
	// }

	return json(result)
}
