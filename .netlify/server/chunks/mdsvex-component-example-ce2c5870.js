import { c as create_ssr_component, v as validate_component } from "./index-44b51311.js";
import { C as Callout } from "./Callout-fbec77d0.js";
const metadata = {
  "title": "A Markdown post with a Svelte component",
  "date": "2021-12-01",
  "updated": "2021-12-01",
  "categories": ["sveltekit", "markdown", "svelte"],
  "coverImage": "/images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg",
  "coverWidth": 16,
  "coverHeight": 9,
  "excerpt": "This post demonstrates how to include a Svelte component in a Markdown post."
};
const Mdsvex_component_example = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>This starter includes an <code>Callout.svelte</code> component. It\u2019s not particularly useful on its own, but here\u2019s how you might use it inside of a Markdown post, thanks to mdsvex.</p>
${validate_component(Callout, "Callout").$$render($$result, {}, {}, {
    default: () => {
      return `This is an example of the Callout.svelte component! Find it in <code>src/lib/components/Callout.svelte</code>.
`;
    }
  })}
<p>You can inject any Svelte components you want into Markdown! Just import them in a <code>&lt;script&gt;</code> tag and then use them wherever you like. </p>
<p>For that matter, you can inject any HTML anywhere! (Note that you cannot use Markdown <em>inside</em> Svelte components or HTML, however. Any opened tag must be closed before returning to Markdown.)</p>`;
});
export { Mdsvex_component_example as default, metadata };
