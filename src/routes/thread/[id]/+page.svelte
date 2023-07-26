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
        }
    </style>
</svelte:head>

<Background/>
<main>
    <div>
        {#await axios.get(`/api/threadData/${data.id}`)}
            <span class='centered'>Loading..</span>
        {:then threadData}
            {#if threadData.data == 'Thread does not exist'}
                <span class='centered'>{threadData.data}</span>
            {:else}
                <div class="layout">
                    {data.id}
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
</style>