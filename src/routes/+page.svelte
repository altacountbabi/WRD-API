<script lang='ts'>
	import Background from '$lib/components/Background.svelte'
    import axios from 'axios'
</script>

<svelte:head>
    <style>
        body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            scroll-behavior: smooth;
        }
    </style>
</svelte:head>

<Background/>
<main>
    <div class='onlineUsers'>
        <span>Online Users:</span>
        <div>
            {#await axios.get('/api/onlineUsers')}
                <span>Loading..</span>
            {:then onlineUsers}
                {#each onlineUsers.data as onlineUser}
                    <a href='/user/{onlineUser.uid}'>{onlineUser.username}</a>
                {/each}
            {/await}
        </div>
    </div>
    <div class='latestThreads'>
        <span>Latest Threads:</span>
        <div>
            {#await axios.get('/api/latestThreads')}
                <span>Loading..</span>
            {:then latestThreads}
                <div class='threads'>
                    {#each latestThreads.data as thread}
                        <div class='thread'>
                            <a href='/thread/{thread.id}' class='thread_title'>{thread.title}</a>
                            <div class='thread_info'>
                                <a href="/user/{thread.author.uid}">By {thread.author.username}</a> | 
                                <span>Replies: {thread.replies}</span> | 
                                <span>Views: {thread.views}</span> | 
                                <a href='user/{thread.lastReplier.uid}'>Last replier: {thread.lastReplier.username}</a>
                            </div>
                        </div>
                    {/each}
                    {#each [0,1,2,3] as _}
                        <br>
                    {/each}
                </div>
            {/await}
        </div>
    </div>
</main>

<style>
    ::-webkit-scrollbar {
        width: 0px;
    }

    main {
        width: calc(100% - 100px);
        height: calc(100% - 100px);
        position: absolute;
        display: flex;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        flex-direction: column;
        align-items: center;
        color: #ddd;
    }
    
    .onlineUsers {
        margin-top: 50px;
        width: 90%;
        height: 90px;
        background: rgba(255, 255, 255, 0.01);
        border: 2px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 10px;   
        display: flex;
        flex-direction: column;
    }

    .onlineUsers > span {
        margin-top: 10px;
        margin-left: 15px;
        margin-bottom: 5px;
        font-size: 18px;
    }

    .onlineUsers > div > a {
        margin-left: 15px;
        color: #ddd;
        text-decoration: none;
    }

    .onlineUsers > div > span {
        margin-left: 15px;
        color: #ddd;
        text-decoration: none;
    }

    .latestThreads {
        margin-top: 15px;
        margin-bottom: 50px;
        width: 90%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background: rgba(255, 255, 255, 0.01);
        border: 2px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border-radius: 10px;   
        display: flex;
        flex-direction: column;
    }

    .latestThreads > span {
        margin-top: 10px;
        margin-left: 15px;
        margin-bottom: 5px;
        font-size: 18px;
    }

    .latestThreads > div > span {
        margin-top: 10px;
        margin-left: 15px;
        margin-bottom: 5px;
        font-size: 18px;
    }

    .threads {
        margin-left: 15px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .thread_title {
        color: #ddd;
        text-decoration: none;
        font-size: 20px;
    }

    .thread {
        display: flex;
        flex-direction: column;
    }

    .thread_info > a {
        color: #ddd;
        text-decoration: none;
    }
</style>