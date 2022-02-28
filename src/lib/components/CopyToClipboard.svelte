<script>
	import { onMount } from 'svelte';
	
	export let wallet;

	let textarea;
	
	onMount(() => {
		textarea.select();
		document.execCommand('copy');
    // console.log("name", name)
	});
</script>

<textarea  bind:value={wallet} bind:this={textarea}></textarea>

