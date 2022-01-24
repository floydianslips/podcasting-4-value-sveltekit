<script context="module">
	export const load = async () => {
		const ReadMeFile = await import('../../README.md');
		const ReadMe = ReadMeFile.default;

		return {
			props: {
				ReadMe
			}
		};
	};
</script>

<script>
	// export let ReadMe;
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
</script>

<svelte:head>
	<title>Podcasting 4 Value</title>
</svelte:head>

<PodcastPlayer />

<!-- Start Podfriend Podcast Widget -->
<!-- End Podfriend Podcast Widget -->
<!-- <svelte:component this={ReadMe} /> -->
<!-- This is the README.md file in the root of the repo. It serves double duty as the homepage's content. If you'd rather use your own HTML and/or Svelte, you can delete/modify everything above this line. -->
