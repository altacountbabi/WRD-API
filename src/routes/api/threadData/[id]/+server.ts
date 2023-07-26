import { json, type RequestEvent } from "@sveltejs/kit"
import * as api from '$lib/api'

export async function GET({ request }: { request: RequestEvent }) {
    let id: string = request.url.href.replace(request.url.origin, '')
    id.substring(id.lastIndexOf('/') + 1)

    const result = await api.fetchThreadData(id)

    if (result.author.uid == '') {
        return json('Thread does not exist')
    }

    return json(result)
}