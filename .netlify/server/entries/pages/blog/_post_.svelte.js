import { c as create_ssr_component, g as escape, d as add_attribute, v as validate_component, m as missing_component, f as each } from "../../../chunks/index-44b51311.js";
function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case "../../lib/posts/heading-links-example.md":
      return import("../../../chunks/heading-links-example-0aa2c4f0.js");
    case "../../lib/posts/mdsvex-component-example.md":
      return import("../../../chunks/mdsvex-component-example-ce2c5870.js");
    case "../../lib/posts/syntax-highlighting-example.md":
      return import("../../../chunks/syntax-highlighting-example-6a085818.js");
    default:
      return new Promise(function(resolve, reject) {
        (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
      });
  }
}
const load = async ({ params }) => {
  try {
    const post = await __variableDynamicImportRuntime0__(`../../lib/posts/${params.post}.md`);
    return {
      props: {
        PostContent: post.default,
        meta: { ...post.metadata, slug: params.post }
      }
    };
  } catch (error) {
    return { status: 404, error: error.message };
  }
};
const U5Bpostu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { PostContent } = $$props;
  let { meta } = $$props;
  const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } = meta;
  if ($$props.PostContent === void 0 && $$bindings.PostContent && PostContent !== void 0)
    $$bindings.PostContent(PostContent);
  if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
    $$bindings.meta(meta);
  return `







${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${add_attribute("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-fsc2lq"><meta property="${"og:title"}"${add_attribute("content", title, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:title"}"${add_attribute("content", title, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:description"}"${add_attribute("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:description"}"${add_attribute("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:width"}"${add_attribute("content", coverWidth, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:height"}"${add_attribute("content", coverHeight, 0)} data-svelte="svelte-fsc2lq">`, ""}


<article class="${"post"}">
  <img class="${"cover-image"}"${add_attribute("src", coverImage, 0)} alt="${""}" style="${"aspect-ratio: " + escape(coverWidth) + " / " + escape(coverHeight) + ";"}"${add_attribute("width", coverWidth, 0)}${add_attribute("height", coverHeight, 0)}>

  <h1>${escape(title)}</h1>
  
  <div class="${"meta"}"><b>Published:</b> ${escape(date)}
    <br>
    <b>Updated:</b> ${escape(updated)}</div>
  
  ${validate_component(PostContent || missing_component, "svelte:component").$$render($$result, {}, {}, {})}

  ${categories ? `<aside class="${"post-footer"}"><h2>Posted in: </h2>
      <ul>${each(categories, (category) => {
    return `<li><a href="${"/blog/category/" + escape(category) + "/"}">${escape(category)}</a>
          </li>`;
  })}</ul></aside>` : ``}</article>`;
});
export { U5Bpostu5D as default, load };
