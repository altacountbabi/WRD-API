<script lang='ts'>
	import Background from '$lib/components/Background.svelte'
    import axios from 'axios'
    import type { PageData } from './$types'
	import Button from '$lib/components/Button.svelte'

    export let data: PageData;
    let a = ''
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
<main on:scroll={() => {a = a == '' ? 'a' : ''}}>
    <span class="CHROME_WEIRD_SHIT_FIX">{a}</span>
    <div>
        {#await axios.get(`/api/threadData/${data.id}`)}
            <span class='centered'>Loading..</span>
        {:then threadData}
            {#if threadData.data == 'Thread does not exist'}
                <span class='centered'>Thread does not exist</span>
            {:else}
                <div class="thread_title">
                    <Button icon='arrow_back_ios' callback={() => window.location.href = '/'}/>
                    <span>{threadData.data.title}</span>
                </div>
                <div class="card">
                    <div class='top'>
                        <div class='pfp'>
                            <img src="{threadData.data.author.pfp}" on:error={() => console.log(`Failed to load image: ${threadData.data.author.pfp}`)} alt='profile_picture' width='128' height='128'>
                        </div>
                        <div class='user_info'>
                            <div class='name'>
                                <a href="/user/{threadData.data.author.uid}" class='username'>{threadData.data.author.username}</a>
                                {#if threadData.data.author.alias != ''}
                                    <span class='alias'>({threadData.data.author.alias})</span>
                                {/if}
                            </div>
                            <span class='reputation'>Reputation: {threadData.data.author.reputation}</span>
                        </div>
                    </div>
                    <div class="bottom">
                        {threadData.data.content}
                    </div>
                </div>
                {#each threadData.data.comments as comment}
                    <div class="card">
                        <div class='top'>
                            <div class='pfp'>
                                <img src={comment.author.pfp} alt='profile_picture' width='128' height='128'>
                            </div>
                            <div class='user_info'>
                                <div class='name'>
                                    <a href="/user/{comment.author.uid}" class='username'>{comment.author.username}</a>
                                    {#if comment.author.alias != ''}
                                        <span class='alias'>({comment.author.alias})</span>
                                    {/if}
                                </div>
                                <span class='reputation'>Reputation: {comment.author.reputation}</span>
                            </div>
                        </div>
                        <div class="bottom">
                            {comment.content}
                        </div>
                    </div>
                {/each}
            {/if}
        {/await}
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
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .centered {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 30px;
        text-align: center;
    }

    .thread_title {
        width: 1000px;
        height: auto;
        margin-top: 50px;
        background: rgba(255, 255, 255, 0.01);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 15px;
        backdrop-filter: blur(10px);
        font-size: 25px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 7px;
    }

    .thread_title > span {
        margin: 0;
        padding: 0;
    }

    .card {
        width: 1000px;
        height: auto;
        margin-top: 50px;
        background: rgba(255, 255, 255, 0.01);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 25px;
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .top {
        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    .pfp {
        width: 128px;
        height: 128px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    .pfp > img {
        border-radius: 5px;
    }

    .user_info {
        width: calc(100% - 210px);
        height: 128px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .username {
        font-size: 25px;
        color: #ddd;
        text-decoration: none;
    }

    .alias {
        font-size: 20px;
        margin-bottom: 15px;
        color: #ccc;
    }

    .bottom {
        display: flex;
        flex-direction: row;
        gap: 5px;
        width: calc(100% - 31px);
        height: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
    }

    .CHROME_WEIRD_SHIT_FIX {
        opacity: 0.001;
    }
</style>