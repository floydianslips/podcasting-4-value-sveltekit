<!-- <script context="module">
	export const load = async () => {
		const ReadMeFile = await import('../../README.md');
		const ReadMe = ReadMeFile.default;

		return {
			props: {
				ReadMe
			}
		};
	};
</script> -->
<script>
	// export const ReadMe;
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
	import Test from '$lib/components/Test.svelte';
	import PostsList from '$lib/components/PostsList.svelte';
	import { fly } from 'svelte/transition';
	import Visibility from '$lib/components/Visibility.svelte';
	import SingleBlogPost from '$lib/components/SingleBlogPost.svelte';

	function getStyle(percent) {
		return `
          opacity: ${percent / 100};
          transform: fade(${percent * 100}deg) ;
      `;
	}
</script>

<svelte:head>
	<title>Podcasting 4 Value</title>
</svelte:head>

<PodcastPlayer />
<!-- <main> -->
<!-- <h1>Hello</h1> -->
<SingleBlogPost />
<!-- <Visibility steps={100} let:percent let:unobserve let:intersectionObserverSupport>
		{#if !intersectionObserverSupport}
			<h2>No IntersectionObserver support? 😢</h2>
		{:else}
			<section> -->
<!-- <span class="top-left">{percent}%</span>
				<span class="top-right">{percent}%</span>
				<span class="bottom-left">{percent}%</span>
				<span class="bottom-right">{percent}%</span> -->

<!-- {#if percent > 70} -->
<!-- <div in:fly={{ duration: 1000, x: -500 }} out:fly={{ duration: 500, x: 500 }}> -->
<!-- <SingleBlogPost /> -->
<!-- </div> -->
<!-- {/if} -->
<!-- </section> -->
<!-- {/if} -->
<!-- </Visibility> -->
<!-- </main> -->
<!-- <svelte:component this={ReadMe} /> -->

<!-- This is the README.md file in the root of the repo. It serves double duty as the homepage's content. If you'd rather use your own HTML and/or Svelte, you can delete/modify everything above this line. -->
<style>
	main {
		text-align: center;
	}

	h1 {
		letter-spacing: 0.1rem;
		margin-bottom: 100vh;
	}

	h2 {
		padding-bottom: 10rem;
	}

	section {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10rem;
		padding: 1rem;
		position: relative;
		box-shadow: 0 0 10px -5px black;
		height: 300px;
	}

	img {
		height: 300px;
		width: 300px;
	}

	.top-left,
	.top-right,
	.bottom-left,
	.bottom-right {
		position: absolute;
		background: yellow;
		padding: 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.top-left {
		top: 0;
		left: 0;
	}

	.top-right {
		top: 0;
		right: 0;
	}

	.bottom-left {
		bottom: 0;
		left: 0;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
	}
</style>
