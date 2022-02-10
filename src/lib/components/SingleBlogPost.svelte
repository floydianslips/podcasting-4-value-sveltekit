<script>
	import { onMount } from 'svelte';
	let posts = [];
	let total = [];
	let imgWidth = '100px';
	onMount(async () => {
		fetch(`/api/posts.json`)
			.then((res) => res.json())
			.then((data) => {
				posts = data.posts;
				console.log('slug', posts[0]?.date);
			})
			.then(() => console.log('fetsch', posts.posts));
		fetch(`/api/posts/count.json`)
			.then((res) => res.json())
			.then((data) => {
				total = data.total;
			});
	});

	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Scroller from '@sveltejs/svelte-scroller';

	import { siteDescription } from '$lib/config';
	import Visibility from './Visibility.svelte';
	import { fly } from 'svelte/transition';
	function getStyle(percent) {
		return `
          opacity: ${percent / 100};
          transform: fade(${percent * 100}deg) ;
      `;
	}
	export let index;
</script>

<svelte:head>
	<title>Blog</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>
<!-- <Scroller top={0.2} bottom={0.8} bind:index bind:offset bind:progress>
	<div slot="background">
		<p>
			This is the background content. It will stay fixed in place while the foreground scrolls over
			the top.
		</p>

		<p>Section {index + 1} is currently active.</p>
	</div> -->

<!-- <section>This is the first section.</section> -->
<!-- <section>This is the second section.</section> -->
<!-- <section>This is the third section.</section> -->
<!-- <div slot="foreground"> -->
<!-- {#each posts as post} -->
<a href="/blog/{posts[index]?.slug}">
	<article>
		<img src={posts[index]?.coverImage} alt="" height={imgWidth} />
		<h3>
			{posts[index]?.title}
		</h3>
	</article>
</a>
<div>
	<p>{posts[index]?.excerpt}</p>
</div>
<!-- {/each} -->
<!-- </div> -->

<!-- </Scroller> -->
<style>
	article {
		display: grid;
		grid-template-columns: 1fr 3fr;
		align-items: center;
	}
	h3 {
		padding: 0px;
		margin: 0px;
		color: var(--green);
	}
	img {
		width: 10rem;
		padding-right: 1rem;
		/* max-width: 100%; */
		height: auto;
	}
	p {
		text-align: center;
	}
</style>
