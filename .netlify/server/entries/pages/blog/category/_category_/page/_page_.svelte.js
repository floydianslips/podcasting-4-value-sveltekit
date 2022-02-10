import { c as create_ssr_component, g as escape, d as add_attribute, v as validate_component } from "../../../../../../chunks/index-44b51311.js";
import { f as fetchPosts } from "../../../../../../chunks/fetchPosts-9b291f21.js";
import { p as postsPerPage, a as siteDescription } from "../../../../../../chunks/config-52afe4d0.js";
import { a as Pagination, P as PostsList } from "../../../../../../chunks/Pagination-88b50502.js";
const load = async ({ fetch, params }) => {
  try {
    const page = params.page ? params.page : 1;
    const { category } = params;
    if (page <= 1) {
      return {
        status: 301,
        redirect: `/blog/category/${category}`
      };
    }
    let offset = page * postsPerPage - postsPerPage;
    const totalPostsRes = await fetch("/api/posts/count.json");
    const { total } = await totalPostsRes.json();
    const { posts } = await fetchPosts({ offset, page });
    return {
      status: 200,
      props: { posts, page, category, totalPosts: total }
    };
  } catch (error) {
    return { status: 404, error: error.message };
  }
};
const U5Bpageu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lowerBound;
  let upperBound;
  let { page } = $$props;
  let { category } = $$props;
  let { totalPosts } = $$props;
  let { posts = [] } = $$props;
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
    $$bindings.totalPosts(totalPosts);
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  lowerBound = page * postsPerPage - (postsPerPage - 1) || 1;
  upperBound = Math.min(page * postsPerPage, totalPosts);
  return `







${$$result.head += `${$$result.title = `<title>Blog - page ${escape(page)}</title>`, ""}<meta data-key="${"description"}"${add_attribute("name", siteDescription, 0)} data-svelte="svelte-1qczpud">`, ""}



${posts.length ? `<h1>Category: ${escape(category)}
    <br>
    <small>Posts ${escape(lowerBound)}\u2013${escape(upperBound)} of ${escape(totalPosts)}</small></h1>
  ${validate_component(Pagination, "Pagination").$$render($$result, {
    currentPage: page,
    totalPosts,
    path: "/blog/category/" + category + "/page"
  }, {}, {})}

  ${validate_component(PostsList, "PostsList").$$render($$result, { posts }, {}, {})}

  ${validate_component(Pagination, "Pagination").$$render($$result, {
    currentPage: page,
    totalPosts,
    path: "/blog/category/" + category + "/page"
  }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
});
export { U5Bpageu5D as default, load };
