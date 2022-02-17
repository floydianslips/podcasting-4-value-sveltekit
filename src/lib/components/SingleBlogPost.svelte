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
			});
		fetch(`/api/posts/count.json`)
			.then((res) => res.json())
			.then((data) => {
				total = data.total;
			});
	});

	import { siteDescription } from '$lib/config';
	export let index;
</script>

<svelte:head>
	<title>Blog</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

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
