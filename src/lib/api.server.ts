import axios from 'axios'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
import sanitizeHtml from 'sanitize-html'

type User = {
    username: string,
    uid: string,
}

type ThreadUser = {
    username: string,
    uid: string,
    pfp: string,
    reputation: number,
    alias: string,
}

type Profile = {
    username: string,
    alias: string,
    pfp: string,
    uid: string,
    reputation: number,
    bio: string
}

type Comment = {
    author: ThreadUser,
    content: string,
    likes: number,
    comments?: Comment[]
}

type Thread = {
    author: ThreadUser,
    title: string,
    content: string,
    likes: number,
    comments: Comment[]
}

type DisplayThread = {
    title: string,
    replies: number,
    views: number,
    lastReplier: User,
    id: string,
    author: User
}

export const getOnlineUsers = async (): Promise<User[]> => {
    let onlineUsers: User[] = []

    const rawHtml = (await axios.get('https://forum.wearedevs.net')).data
    const dom = new JSDOM(rawHtml, { includeNodeLocations: true })

    const onlineList = dom.window.document.querySelector('.onlineList > div > p')
    onlineList?.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
        const username = a.textContent?.trim() as string
        const uid = a.getAttribute('href')?.replace('/profile?uid=', '') as string

        if (username !== '' && uid !== '') {
            onlineUsers.push({
                username,
                uid
            })
        }
    })
  
    return onlineUsers
}

export const getLatestThreads = async (): Promise<DisplayThread[]> => {
    let latestThreads: DisplayThread[] = []

    const rawHtml = (await axios.get('https://forum.wearedevs.net/c/all')).data
    const dom = new JSDOM(rawHtml, { includeNodeLocations: true })
    const document = dom.window.document

    const threads = document.querySelectorAll('tbody > tr')
    threads.forEach(thread => {
        const title = thread.querySelector('td > a')?.textContent?.trim() as string
        const id = thread.querySelector('td > a')?.getAttribute('href')?.replace('\/t\/', '') as string
        const replies = parseInt(thread.querySelectorAll('td[class="not-mobile"]')[0].textContent?.trim() as string)
        const views = parseInt(thread.querySelectorAll('td[class="not-mobile"]')[1].textContent?.trim() as string)
        const lastReplier: User = {
            username: thread.querySelectorAll('td[class="not-mobile"]')[2].querySelector('a')?.textContent?.trim() as string,
            uid: thread.querySelectorAll('td[class="not-mobile"]')[2].querySelector('a')?.getAttribute('href')?.replace('/profile?uid=', '') as string
        }
        const author = {
            username: thread.querySelector('td > p > a')?.textContent?.trim() as string,
            uid: thread.querySelector('td > p > a')?.getAttribute('href')?.replace('/profile?uid=', '') as string
        }

        latestThreads.push({
            title, replies, views, lastReplier, id, author
        })
    })

    return latestThreads
}

export const fetchThreadData = async (id: string): Promise<Thread> => {
    let threadData: Thread = {
        author: {
            uid: '',
            username: '',
            pfp: '',
            alias: '',
            reputation: 0
        },
        comments: [],
        content: '',
        title: '',
        likes: 0,
    }

    const url = `https://forum.wearedevs.net/t/${id}`
    try {
        const rawHtml = (await axios.get(url)).data
        const dom = new JSDOM(rawHtml, { includeNodeLocations: true })
        const document = dom.window.document

        const title = document.querySelector('#topic')?.textContent?.trim() as string
        const replycards = document.querySelectorAll('.replygroup')
        
        threadData.title = title
        replycards.forEach((card, idx) => {
            if (idx == 0) {
                const likes = parseInt(card.querySelector('.btnLikeReply')?.textContent?.trim() as string)
                const content = card.querySelector('.thread_replycontent')?.innerHTML as string

                threadData.content = content
                threadData.likes = likes

                let pfp = card.querySelector('.thread_pfp')?.getAttribute('style')?.replace('background-image: url(\'', '').replace('\')', '') as string

                if (pfp.startsWith('/')) pfp = `https://forum.wearedevs.net${pfp}`
                const uid = card.querySelector('a[href^="/profile?uid="]')?.getAttribute('href')?.replace('/profile?uid=', '') as string
                threadData.author.pfp = pfp
                threadData.author.uid = uid
                threadData.author.username = card.querySelector('.username')?.textContent?.trim() as string
                threadData.author.alias = card.querySelector('.usertitle')?.textContent?.trim() || ''
                threadData.author.reputation = parseInt((card.querySelector('.good')?.textContent?.trim() as string) || (card.querySelector('.bad')?.textContent?.trim() as string)) || 0


                const comments = card.querySelectorAll('.replycard')[1] || null
                if (comments != null) {
                    const actualComments = comments.querySelector('.comments')
                    actualComments?.querySelectorAll('.comment').forEach(comment => {
                        let commentPfp = comment.querySelector('.commentPfp')?.getAttribute('style')?.replace('background-image: url(\'', '').replace('\')', '') as string
                        if (commentPfp.startsWith('/')) commentPfp = `https://forum.wearedevs.net${commentPfp}`

                        const commentAuthor: ThreadUser = {
                            username: comment.querySelector('.username')?.textContent?.trim() as string,
                            uid: comment.querySelector('.username')?.getAttribute('href')?.replace('/profile?uid=', '') as string,
                            alias: '',
                            pfp: commentPfp,
                            reputation: parseInt((comment.querySelector('.good')?.textContent?.trim() as string) || (comment.querySelector('.bad')?.textContent?.trim() as string)) || 0
                        }
                        
                        threadData.comments.push({
                            author: commentAuthor,
                            content: comment.querySelector('.thread_replycontent')?.innerHTML as string,
                            likes: parseInt(comment.querySelector('.btnLikeReply')?.textContent as string)
                        })
                    })
                }
            } else {
                if (card.classList.contains('comment')) return
                let commentData: Comment = {
                    content: '',
                    likes: 0,
                    author: {
                        alias: '',
                        pfp: '',
                        reputation: 0,
                        uid: '',
                        username: ''
                    },
                    comments: []
                }

                const likes = parseInt(card.querySelector('.btnLikeReply')?.textContent?.trim() as string)
                let content = card.querySelector('.thread_replycontent')?.innerHTML as string
                
                commentData.content = content
                commentData.likes = likes

                let pfp = card.querySelector('.thread_pfp')?.getAttribute('style')?.replace('background-image: url(\'', '').replace('\')', '') as string

                if (pfp != undefined && pfp.startsWith('/')) pfp = `https://forum.wearedevs.net${pfp}`
                const uid = card.querySelector('a[href^="/profile?uid="]')?.getAttribute('href')?.replace('/profile?uid=', '') as string
                commentData.author.pfp = pfp
                commentData.author.uid = uid
                commentData.author.username = card.querySelector('.username')?.textContent?.trim() as string
                commentData.author.alias = card.querySelector('.usertitle')?.textContent?.trim() || ''
                commentData.author.reputation = parseInt((card.querySelector('.good')?.textContent?.trim() as string) || (card.querySelector('.bad')?.textContent?.trim() as string)) || 0

                threadData.comments.push(commentData)

                const comments = card.querySelector('.comments') || null
                if (comments != null) {
                    const actualComments = comments.querySelector('.commentGroups')
                    actualComments?.querySelectorAll('.comment').forEach(comment => {
                        let commentPfp = comment.querySelector('.commentPfp')?.getAttribute('style')?.replace('background-image: url(\'', '').replace('\')', '') as string
                        if (commentPfp.startsWith('/')) commentPfp = `https://forum.wearedevs.net${commentPfp}`

                        const commentAuthor: ThreadUser = {
                            username: comment.querySelector('.username')?.textContent?.trim() as string,
                            uid: comment.querySelector('.username')?.getAttribute('href')?.replace('/profile?uid=', '') as string,
                            alias: '',
                            pfp: commentPfp,
                            reputation: parseInt((comment.querySelector('.good')?.textContent?.trim() as string) || (comment.querySelector('.bad')?.textContent?.trim() as string)) || 0
                        }

                        commentData.comments?.push({
                            author: commentAuthor,
                            content: comment.querySelector('.thread_replycontent')?.innerHTML as string,
                            likes: parseInt(comment.querySelector('.btnLikeReply')?.textContent as string)
                        })
                    })
                }
            }
        })

        return threadData
    } catch (ex) {
        console.log(ex)
        return threadData
    }
}

export const fetchProfileData = async (uid: string): Promise<Profile> => {
    let profileData: Profile = {
        uid,
        bio: '',
        pfp: '',
        alias: '',
        reputation: 0,
        username: ''
    }

    const url = `https://forum.wearedevs.net/profile?uid=${uid}`
    try {
        const rawHtml = (await axios.get(url)).data
        const loaded = cheerio.load(rawHtml)
        let pfp = loaded('#profile_mainprofilepicture').attr('src')

        if (pfp?.startsWith('/')) {
            pfp = `https://forum.wearedevs.net${pfp}`
        }

        profileData.pfp = pfp as string
        let alias: string = loaded('.alias').text().trim()
        profileData.username = (loaded('.username').text().trim()).replace(`\n${alias}`, '')
        profileData.alias = alias.substring(1, alias.length - 1)
        profileData.bio = loaded('.biography').text().trim()
        profileData.reputation = parseInt(loaded(`a[href="/profile/reputation?uid=${uid}"]`).text().trim())
        
        return profileData
    } catch {
        return profileData
    }
}