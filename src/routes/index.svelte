<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import { fly } from 'svelte/transition';
	import SingleBlogPost from '$lib/components/SingleBlogPost.svelte';
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
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
	<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</svelte:head>

<div class="main-div">
	<h1>One idiot's attempt at starting a Value 4 Value podcast.</h1>
	<PodcastPlayer />

	<Scroller {top} {threshold} {bottom} bind:count bind:index bind:offset bind:progress>
		<div class="scroller-div" slot="foreground">
			<section class="section-1">
				{#if offset > -0.01 && index == 0}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={0} />
					</article>
				{/if}
			</section>
			<section class="section-2">
				{#if offset > -0.01 && index == 1}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={1} />
					</article>
				{/if}
			</section>
			<section class="section-3">
				{#if offset > -0.01 && index == 2}
					<article in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 1000, x: 500 }}>
						<SingleBlogPost index={2} />
					</article>
				{/if}
			</section>
		</div>
	</Scroller>
</div>

<style>
	.main-div {
		display: grid;
		justify-items: center;
		/* z-index: -1; */
	}

	h1 {
		font-size: 1.5rem;
		text-align: center;
		margin: 0 0 1rem 0;
	}
	[slot='foreground'] section {
		pointer-events: all;
	}
	.scroller-div {
		width: 100%;
	}
	.section-1 {
		background-image: url('../images/laptop-microphone.jpg');
	}
	.section-2 {
		background-image: url('../images/sat-dish.jpg');
	}
	.section-3 {
		background-image: url('../images/mixer.jpg');
	}
	article {
		display: grid;
		background-color: rgb(0, 0, 0); /* Fallback color */
		background-color: rgba(0, 0, 0, 0.8); /* Black w/opacity/see-through */
		color: white;
		font-weight: bold;
		border: 3px solid #f1f1f1;
		height: fit-content;
		overflow-y: hidden;
		padding: 20px;
		text-align: center;
	}
	.scroller-div {
		z-index: 1;
	}
	section {
		display: grid;
		width: 100%;
		align-items: center;
		height: 40vh;
		background-color: var(--darkBlue);
		color: white;
		padding: 1em;
		background-size: cover;
		background-position: center;
		/* margin: 0 0 2em 0; */
		overflow-x: hidden;
		color: white;
		font-weight: bold;
		border: 3px solid #f1f1f1;
		/* position: absolute; */
		/* top: 50%; */
		/* left: 50%; */
		/* transform: translate(-50%, -50%); */
		/* z-index: 2; */
		/* width: 80%; */
		padding: 20px;
		text-align: center;
	}
</style>
