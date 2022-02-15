import { c as create_ssr_component, d as add_attribute, v as validate_component } from "../../chunks/index-44b51311.js";
import { C as Callout } from "../../chunks/Callout-fbec77d0.js";
import { a as siteDescription } from "../../chunks/config-52afe4d0.js";
const prerender = true;
const Contact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Contact</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${add_attribute("content", siteDescription, 0)} data-svelte="svelte-1a570lt">`, ""}

<h1>Contact</h1>

${validate_component(Callout, "Callout").$$render($$result, {}, {}, {
    default: () => {
      return `What&#39;s on your mind?`;
    }
  })}

<form name="${"contact"}" method="${"post"}" netlify netlify-honeypot="${"bot-field"}"><input type="${"hidden"}" name="${"form-name"}" value="${"contact"}">
	
	<div class="${"form-section"}"><label>Your Name: <input type="${"text"}" name="${"name"}"></label></div>
	<div class="${"form-section"}"><label>Your Email: <input type="${"email"}" name="${"email"}"></label></div>
	<div class="${"form-section"}"><label>Message: <textarea name="${"message"}"></textarea></label></div>
	<div class="${"form-section"}"><button type="${"submit"}">Send</button></div></form>`;
});
export { Contact as default, prerender };
