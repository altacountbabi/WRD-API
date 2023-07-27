import axios from 'axios'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom';

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
    content: string
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
    id: string
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

    
    // onlineList.find('a').each((_, element) => {
        // const username = loaded(element).text().trim()
        // const profileUrl = loaded(element).attr('href')
//   
        // if (username !== '' && profileUrl !== '') onlineUsers.push({ username, uid: profileUrl?.replace('/profile?uid=', '') as string })
    // })
  
    return onlineUsers
}

export const getLatestThreads = async (): Promise<DisplayThread[]> => {
    let latestThreads: DisplayThread[] = []

    const url = 'https://forum.wearedevs.net/c/all'
    const rawHtml = (await axios.get(url)).data
    const loaded = cheerio.load(rawHtml)


    loaded('table.forumcontainer tbody tr').each((_, element) => {
        const columns = loaded(element).find('td')

        const title = columns.find('a.thread-title').text().trim()
        const replies = parseInt(columns.eq(1).text().trim(), 10)
        const views = parseInt(columns.eq(2).text().trim(), 10)
        const lastReplier = columns.find('a[href^="/profile"]')

        const lastReplierUser: User = {
            username: lastReplier.html() as string,
            uid: lastReplier.attr('href')?.replace('/profile?uid=', '') as string
        }

        latestThreads.push({ title, replies, views, lastReplier: lastReplierUser, id: columns.find('a.thread-title').attr('href')?.replace('\/t\/', '') as string })
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
        const loaded = cheerio.load(rawHtml)
        const replyGroups = loaded('.replygroup')
        
        replyGroups.each((index, element) => {
            const replyGroup = loaded(element)
            const replierData = replyGroup.find('.thread_replierdata')
            const replyCard = replyGroup.find('> .replycard:not(:has(> div.comment))')

            if (replyCard.length > 0) {
                if (index == 0) {
                    const userStats = loaded('.userstats')
                    let pfp = replierData.find('.thread_pfp').attr('style')?.replace('background-image: url(\'', '').replace('\')', '') as string

                    if (pfp.startsWith('/')) pfp = `https://forum.wearedevs.net${pfp}`

                    threadData.author.pfp = pfp
                    threadData.author.alias = replierData.find('.userdesc > .usertitle').text().trim() || ''
                    threadData.author.username = replierData.find('.username').text().trim()
                    threadData.author.uid = replierData.find('a').attr('href')?.replace('/profile?uid=', '') as string
                    threadData.content = replyCard.find('> .thread_replycontent').text().trim()
                    threadData.title = loaded('#topic').text().trim()
                    threadData.likes = parseInt(loaded('.btnLikeReply').html()?.trim() as string)
                    threadData.author.reputation = parseInt(userStats.eq(index).find('p:has(span) span').text().trim())
                } else {
                    const userStats = loaded('.userstats')
                    const username = replierData.find('.username').text().trim()
                    let pfp = replierData.find('.thread_pfp').attr('style')?.replace('background-image: url(\'', '').replace('\')', '') as string

                    if (pfp.startsWith('/')) pfp = `https://forum.wearedevs.net${pfp}`

                    const parsedComment: Comment = {
                        author: {
                            uid: replierData.find('a').attr('href')?.trim().replace('/profile?uid=', '') as string,
                            username,
                            alias: replierData.find('.userdesc > .usertitle').text().trim() || '',
                            reputation: parseInt(userStats.find('p:has(span) span').html() as string),
                            pfp
                        },
                        content: replyCard.find('> .thread_replycontent').text().trim()
                    }

                    threadData.comments.push(parsedComment)
                }
            }
        })
        
        return threadData
    } catch {
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