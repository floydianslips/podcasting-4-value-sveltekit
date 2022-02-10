<script>
	import Visibility from './Visibility.svelte';

	function getStyle(percent) {
		return `
          opacity: ${percent / 100};
          transform: rotate(${percent * 3.6}deg) scale(${percent / 100});
      `;
	}
</script>

<main>
	<h1>Scroll down</h1>

	<Visibility steps={100} let:percent let:unobserve let:intersectionObserverSupport>
		{#if !intersectionObserverSupport}
			<h2>No IntersectionObserver support? 😢</h2>
		{:else}
			<section style={getStyle(percent)}>
				<span class="top-left">{percent}%</span>
				<span class="top-right">{percent}%</span>
				<span class="bottom-left">{percent}%</span>
				<span class="bottom-right">{percent}%</span>

				<img alt="Robot" src="https://robohash.org/svelte-is-awesome.png" />
			</section>
		{/if}
	</Visibility>
</main>

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
