<script context="module">
	export const prerender = true;
</script>

<script>
	import Callout from '$lib/components/Callout.svelte';
	import { siteDescription, siteEmail } from '$lib/config';
</script>

<svelte:head>
	<title>Contact</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<h1>Contact</h1>

<Callout
	>What's on your mind?
	<div class="email">
		<a href="mailto:{siteEmail}">podcasting4value@protonmail.com</a>
	</div>
</Callout>

<form name="contact" method="post" netlify netlify-honeypot="bot-field">
	<input type="hidden" name="form-name" value="contact" />
	<!-- <input type="text" name="bot-field" /> -->
	<div class="form-section">
		<label>Your Name: <input type="text" name="name" /></label>
	</div>
	<div class="form-section">
		<label>Your Email: <input type="email" name="email" /></label>
	</div>
	<div class="form-section">
		<label>Message: <textarea name="message" /></label>
	</div>
	<div class="form-section">
		<button type="submit">Send</button>
	</div>
</form>
