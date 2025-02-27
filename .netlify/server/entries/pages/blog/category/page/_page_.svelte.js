import { c as create_ssr_component, g as escape, d as add_attribute, v as validate_component } from "../../../../../chunks/index-4fee9b32.js";
import { f as fetchPosts } from "../../../../../chunks/fetchPosts-01a20bea.js";
import { p as postsPerPage, a as siteDescription } from "../../../../../chunks/config-702cd8c2.js";
import { a as Pagination, P as PostsList } from "../../../../../chunks/Pagination-c5dabe92.js";
const load = async ({ fetch, params }) => {
  try {
    const page = params.page ? params.page : 1;
    if (page <= 1) {
      return { status: 301, redirect: "/blog" };
    }
    let offset = page * postsPerPage - postsPerPage;
    const totalPostsRes = await fetch("/api/posts/count.json");
    const { total } = await totalPostsRes.json();
    const { posts } = await fetchPosts({ offset, page });
    return {
      status: 200,
      props: { posts, page, totalPosts: total }
    };
  } catch (error) {
    return { status: 404, error: error.message };
  }
};
const U5Bpageu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lowerBound;
  let upperBound;
  let { page } = $$props;
  let { totalPosts } = $$props;
  let { posts = [] } = $$props;
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
    $$bindings.totalPosts(totalPosts);
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  lowerBound = page * postsPerPage - (postsPerPage - 1) || 1;
  upperBound = Math.min(page * postsPerPage, totalPosts);
  return `







${$$result.head += `${$$result.title = `<title>Blog - page ${escape(page)}</title>`, ""}<meta data-key="${"description"}"${add_attribute("name", siteDescription, 0)} data-svelte="svelte-1qczpud">`, ""}



${posts.length ? `<h1>Posts ${escape(lowerBound)}\u2013${escape(upperBound)} of ${escape(totalPosts)}</h1>
  ${validate_component(Pagination, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}

  ${validate_component(PostsList, "PostsList").$$render($$result, { posts }, {}, {})}

  ${validate_component(Pagination, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
});
export { U5Bpageu5D as default, load };
