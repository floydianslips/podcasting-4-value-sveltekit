<script>
	import { cryptoInfo } from '$lib/cryptoInfo';
	const sortedCrypto = () => {
		cryptoInfo.map((item) => {
			console.log(item);
		});
	};
	let selected;
	let answer = '';
	import CopyToClipBoard from '$lib/components/CopyToClipboard.svelte';
	
	let name;

	const copy = (wallet) => {
		console.log(wallet)
		const app = new CopyToClipBoard({
			target: document.getElementById('clipboard'),
			props: {wallet},
		});
		app.$destroy();
	}
	
</script>

<h1>Cryptocurrency</h1>
<table class="donation-table">
	<tbody>
		<tr
			><td>
				<h3>Crypto</h3>
				<select bind:value={selected} on:change={() => (answer = '')}>
					{#each cryptoInfo as crypto}
						<option value={crypto}>
							{crypto.name}
						</option>
					{/each}
				</select>
				{#if selected}
					<span>{selected.wallet}</span>
				<div class="copy">
					<input disabled bind:value={selected.wallet}>
					<button on:click={copy(selected.wallet)}>copy</button>
					<div id="clipboard"></div>
				</div>

				{/if}
			</td><td>
				{#if selected}
					<div class="qr-code">
						<img class="qr-code" src={selected.qrCode} alt={selected.name + ' qr code'} />
					</div>
				{:else}
					<p>loading</p>
				{/if}
			</td></tr
		>
	</tbody>
</table>

<style>
	.copy {
		display: grid;
		justify-items: center;
	}
		button {
			background: var(--green);
		}
		button:hover {
			background: var(--darkBlue);
		}

	input {
		display: none
	}
	select {
		width: fit-content;
		padding: 10px 15px;
		border: 1px dashed blue;
		border-radius: 4px;
		background-color: var(--green);
		margin: 1rem 0px;
		letter-spacing: 2px;
		font-size: 1rem;
	}
	table {
		border: 1px (val);
	}
	h3 {
		font-size: 1.5rem;
		margin: 0px;
	}
	h1 {
		font-size: 2rem;
		margin: 0px;
		padding: 0px;
		align-self: center;
		text-align: center;
	}
	span {
		margin: 0px;
		width: auto;
	}
	img {
		width: 10rem;
		padding: 0px;
	}
</style>
