import { c as create_ssr_component } from "./index-44b51311.js";
const metadata = {
  "title": "Automatic heading links in mdsvex",
  "date": "2021-10-26",
  "updated": "2021-11-01",
  "categories": ["sveltekit", "markdown"],
  "coverImage": "/images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg",
  "coverWidth": 16,
  "coverHeight": 9,
  "excerpt": "Check out how heading links work with this starter in this post."
};
const Heading_links_example = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>Here are some headings:</p>
<h2 id="${"heres-an-h2"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#heres-an-h2"}"><span class="${"icon icon-link"}"></span></a>Here\u2019s an h2</h2>
<p>Lorem ipsum dolor sit amet</p>
<h3 id="${"this-is-an-h3"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-is-an-h3"}"><span class="${"icon icon-link"}"></span></a>This is an h3</h3>
<p>Lorem ipsum dolor sit amet</p>
<h4 id="${"as-youve-probably-guessed-this-is-an-h4"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#as-youve-probably-guessed-this-is-an-h4"}"><span class="${"icon icon-link"}"></span></a>As you\u2019ve probably guessed, this is an h4</h4>
<p>Lorem ipsum dolor sit amet</p>
<h5 id="${"this-of-course-is-an-h5"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-of-course-is-an-h5"}"><span class="${"icon icon-link"}"></span></a>This, of course, is an h5</h5>
<p>Lorem ipsum dolor sit amet</p>
<h6 id="${"were-deep-in-h6-territory-now"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#were-deep-in-h6-territory-now"}"><span class="${"icon icon-link"}"></span></a>We\u2019re deep in h6 territory now</h6>
<p>Lorem ipsum dolor sit amet</p>`;
});
export { Heading_links_example as default, metadata };
