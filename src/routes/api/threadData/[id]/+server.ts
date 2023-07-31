import { json, type RequestEvent } from "@sveltejs/kit"
import * as api from "$lib/api.server.js"

export async function GET({ request }: any) {
	let id: string = request.url
		.match(/\/[0-9a-zA-Z]+/g)
		?.join("")
		.replace("/wrd/api/threadData/", "") as string
	const result = await api.fetchThreadData(id)

	if (result.author.uid == "") {
		return json("Thread does not exist")
	}

	return json(result)
}
