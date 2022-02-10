<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import LoremIpsum from '$lib/components/LoremIpsum.svelte';
	import DraggableLabel from '$lib/components/DraggableLabel.svelte';
	import { fade, fly } from 'svelte/transition';
	import SingleBlogPost from '$lib/components/SingleBlogPost.svelte';
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
	import { onMount } from 'svelte';
	import { siteDescription } from '$lib/config';

	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;
</script>

<svelte:head>
	<title>Home</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<div class="main-div">
	<h1>One idiot's attempt at starting a Value 4 Value podcast.</h1>
	<PodcastPlayer />

	<Scroller {top} {threshold} {bottom} bind:count bind:index bind:offset bind:progress>
		<div class="scroller-div" slot="foreground">
			<section>
				{#if offset > -0.01 && index == 0}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={2} />
					</article>
				{/if}
			</section>
			<section>
				{#if offset > -0.01 && index == 1}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={1} />
					</article>
				{/if}
			</section>
			<section>
				{#if offset > -0.01 && index == 2}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={2} />
					</article>
				{/if}
			</section>
		</div>
	</Scroller>

	<!-- <DraggableLabel bind:value={top} label="top" />
	<DraggableLabel bind:value={threshold} label="threshold" />
	<DraggableLabel bind:value={bottom} label="bottom" /> -->
</div>

<style>
	.main-div {
		display: grid;
		justify-items: center;
	}
	h1 {
		font-size: 1.5rem;
		text-align: center;
	}
	[slot='foreground'] section {
		pointer-events: all;
	}
	.scroller-div {
		width: 100%;
	}
	section {
		display: grid;
		width: 100%;
		align-items: center;
		height: 30vh;
		background-color: var(--darkBlue);
		color: white;
		padding: 1em;
		margin: 0 0 2em 0;
		overflow-x: hidden;
	}
</style>
