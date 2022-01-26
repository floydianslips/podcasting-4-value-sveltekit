<script context="module">
	export const prerender = true;
</script>

<script>
	import Callout from '$lib/components/Callout.svelte';
</script>

<h1>Contact</h1>

<Callout>What's on your mind?</Callout>

<form
	name="contact"
	method="post"
	netlify
	netlify-honeypot="bot-field"
	data-netlify-recaptcha="true"
>
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
