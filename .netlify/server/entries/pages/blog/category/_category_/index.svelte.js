import { c as create_ssr_component, g as escape, v as validate_component } from "../../../../../chunks/index-44b51311.js";
import { f as fetchPosts } from "../../../../../chunks/fetchPosts-9b291f21.js";
import { P as PostsList, a as Pagination } from "../../../../../chunks/Pagination-88b50502.js";
import "../../../../../chunks/config-52afe4d0.js";
const load = async ({ params, fetch }) => {
  const category = params.category;
  const options = { category };
  const { posts } = await fetchPosts(options);
  const res = await fetch(`/api/posts/category/${category}/count.json`);
  const { total } = await res.json();
  return { props: { posts, category, total } };
};
const U5Bcategoryu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts } = $$props;
  let { category } = $$props;
  let { total } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0)
    $$bindings.total(total);
  return `






${$$result.head += `${$$result.title = `<title>Category: ${escape(category)}</title>`, ""}`, ""}


<h1>Blog category: ${escape(category)}</h1>

${posts.length ? `${validate_component(PostsList, "PostsList").$$render($$result, { posts }, {}, {})}
  ${validate_component(Pagination, "Pagination").$$render($$result, {
    currentPage: "1",
    totalPosts: total,
    path: "/blog/category/" + category + "/page"
  }, {}, {})}` : `<p><strong>Ope!</strong> Sorry, couldn&#39;t find any posts in the category &quot;${escape(category)}&quot;.</p>

  <p><a href="${"/blog"}">Back to blog</a></p>`}`;
});
export { U5Bcategoryu5D as default, load };
