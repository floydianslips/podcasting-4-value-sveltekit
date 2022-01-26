<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>

<h1>Contact</h1>

<form name="contact" method="post" netlify netlify-honeypot="bot-field">
	<input type="hidden" name="form-name" value="contact" />
	<!-- <input type="text" name="bot-field" /> -->
	<p class="form-section">
		<label>Your Name: <input type="text" name="name" /></label>
	</p>
	<p class="form-section">
		<label>Your Email: <input type="email" name="email" /></label>
	</p>
	<p class="form-section">
		<label>Message: <textarea name="message" /></label>
	</p>
	<p>
		<button type="submit">Send</button>
	</p>
</form>
