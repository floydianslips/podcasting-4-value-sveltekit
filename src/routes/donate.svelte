<script>
	import SvelteTable from 'svelte-table';
	import { cryptoInfo } from '$lib/cryptoInfo';
	import { siteDescription } from '$lib/config';

	const rows = cryptoInfo;

	// define column configs
	const columns = [
		{
			key: 'icon',
			title: '',
			value: (v) => v.icon,
			renderValue: (v) => `<img src=${v.icon} alt="${v.name + ' icon'}"/>`
		},
		{
			key: 'name',
			title: 'name',
			value: (v) => v.name,
			sortable: true,
			filterOptions: (rows) => {
				// use first letter of name to generate filter
				let letrs = {};
				rows.forEach((row) => {
					let letr = row.name.charAt(0);
					if (letrs[letr] === undefined)
						letrs[letr] = {
							name: `${letr.toUpperCase()}`,
							value: letr.toLowerCase()
						};
				});
				// fix order
				letrs = Object.entries(letrs)
					.sort()
					.reduce((o, [k, v]) => ((o[k] = v), o), {});
				return Object.values(letrs);
			},
			filterValue: (v) => v.name.charAt(0).toLowerCase()
		},
		{
			key: 'wallet',
			title: 'Wallet',
			value: (v) => v.wallet
		},
		{
			key: 'qrCode',
			title: 'QR Code',
			value: (v) => v.qrCode,
			renderValue: (v) =>
				`<div class="qr-code"><img class="qr-code" src=${v.qrCode} alt="${
					v.name + ' qr code'
				}" /></div>`
		}
	];
</script>

<svelte:head>
	<title>Donate</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>
<SvelteTable {columns} {rows} classNameTable={['donation-table']} />
