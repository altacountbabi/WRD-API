<script lang='ts'>
	import Background from '$lib/components/Background.svelte'
    import axios from 'axios'
    import type { PageData } from './$types'

    export let data: PageData;
</script>

<svelte:head>
    <style>
        body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: poppins,Poppins,Arial,sans-serif;
            scroll-behavior: smooth;
        }
    </style>
    <title>User</title>
</svelte:head>

<Background/>
<main>
    <div>
        {#await axios.get(`/api/profileData/${data.uid}`)}
            <span class='centered'>Loading..</span>
        {:then profileData}
            {#if profileData.data == 'Profile does not exist'}
                <span class='centered'>Profile does not exist</span>
            {:else}
                <div class='layout'>
                    <div class='top'>
                        <div class='pfp'>
                            <img src={profileData.data.pfp} alt='profile_picture' width='128' height='128'>
                        </div>
                        <div class='user_info'>
                            <div class='name'>
                                <span class='username'>{profileData.data.username}</span>
                                {#if profileData.data.alias != ''}
                                    <span class='alias'>({profileData.data.alias})</span>
                                {/if}
                            </div>
                            <span class='reputation'>Reputation: {profileData.data.reputation}</span>
                        </div>
                    </div>
                    {#if profileData.data.bio != ''}
                        <div class='bottom'>
                            <span class='bio_title'>Bio</span>
                            <span class='bio'>{profileData.data.bio}</span>
                        </div>
                    {/if}
                </div>
            {/if}
        {/await}
    </div>
</main>

<style>
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

    .centered {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 30px;
        text-align: center;
    }

    .layout {
        width: 754px;
        height: 300px;
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

    .bio_title {
        font-size: 24px;
    }

    .bio {
        color: #ccc;
    }
</style>