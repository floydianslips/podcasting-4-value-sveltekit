<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>
<h1>Contact</h1>

<form
	name="contact"
	method="post"
	netlify
	netlify-honeypot="bot-field"
	data-netlify-recaptcha="true"
>
	<input type="hidden" name="contact" value="contact" />
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
	<p>
		<button type="submit">Send</button>
	</p>
</form>
