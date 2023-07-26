<script lang='ts'>
    export let icon: string
    export let callback: () => void
</script>

<link href='https://fonts.googleapis.com/icon?family=Material+Icons+Round' rel='stylesheet'>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class='btn' on:click={callback}>
    <span class="material-icons-round">{icon}</span>
</div>

<style>
    .btn {
        width: 48px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        cursor: pointer;
        border-radius: 5px;
        transition: background 0.3s ease-in-out;
    }

    .btn:hover {
        background: rgba(255, 255, 255, 0.03);
    }
</style>