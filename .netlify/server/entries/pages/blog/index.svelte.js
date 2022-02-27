import { c as create_ssr_component, d as add_attribute, v as validate_component } from "../../../chunks/index-4fee9b32.js";
import { P as PostsList, a as Pagination } from "../../../chunks/Pagination-c5dabe92.js";
import { a as siteDescription } from "../../../chunks/config-702cd8c2.js";
const load = async ({ fetch }) => {
  const postRes = await fetch(`/api/posts.json`);
  const { posts } = await postRes.json();
  const totalRes = await fetch(`/api/posts/count.json`);
  const { total } = await totalRes.json();
  return { props: { posts, total } };
};
const Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts } = $$props;
  let { total } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0)
    $$bindings.total(total);
  return `${$$result.head += `${$$result.title = `<title>Blog</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${add_attribute("content", siteDescription, 0)} data-svelte="svelte-1t9o4xr">`, ""}

<h1>Blog</h1>

${validate_component(PostsList, "PostsList").$$render($$result, { posts }, {}, {})}

${validate_component(Pagination, "Pagination").$$render($$result, { currentPage: 1, totalPosts: total }, {}, {})}`;
});
export { Blog as default, load };
