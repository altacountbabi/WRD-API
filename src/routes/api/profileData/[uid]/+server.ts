import { json } from "@sveltejs/kit"
import * as api from "$lib/api.server.js"

export async function GET({ request }: { request: Request }) {
	let uid: string = request.url
		.match(/\/[0-9a-zA-Z]+/g)
		?.join("")
		.replace("/wrd/api/profileData/", "") as string
	console.log(uid)
	const result = await api.fetchProfileData(uid)

	if (result.username == "") {
		return json("Profile does not exist")
	}

	return json(result)
}
