import type { PageLoad } from './$types'

export const load = (({ params }) => {
    return {
        uid: params.uid
    }
}) satisfies PageLoad