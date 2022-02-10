import { c as create_ssr_component, f as each, g as escape, d as add_attribute } from "./index-44b51311.js";
import { p as postsPerPage } from "./config-52afe4d0.js";
const PostsList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  console.log("list", posts);
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  return `<ul class="${"posts-list"}">${each(posts, (post) => {
    return `<li><article><a href="${"/blog/" + escape(post.slug)}"><img${add_attribute("src", post.coverImage, 0)} alt="${""}"${add_attribute("width", post.coverWidth, 0)}${add_attribute("height", post.coverHeight, 0)} style="${"ratio: " + escape(post.coverWidth) + " / " + escape(post.coverHeight)}">
					<h2>${escape(post.title)}</h2>
				</a></article>

			<p>${escape(post.excerpt)}</p>
		</li>`;
  })}</ul>`;
});
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { currentPage } = $$props;
  let { totalPosts } = $$props;
  let { path = "/blog/page" } = $$props;
  let pagesAvailable;
  const isCurrentPage = (page) => page == currentPage;
  if ($$props.currentPage === void 0 && $$bindings.currentPage && currentPage !== void 0)
    $$bindings.currentPage(currentPage);
  if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
    $$bindings.totalPosts(totalPosts);
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  pagesAvailable = Math.ceil(totalPosts / postsPerPage);
  return `
${pagesAvailable > 1 ? `<nav aria-label="${"Pagination navigation"}" class="${"pagination"}"><ul>${each(Array.from({ length: pagesAvailable }, (_, i) => i + 1), (page) => {
    return `<li><a href="${escape(path) + "/" + escape(page)}"${add_attribute("aria-current", isCurrentPage(page), 0)}><span class="${"sr-only"}">${isCurrentPage(page) ? `Current page:` : `Go to page`}</span>
              ${escape(page)}</a>
          </li>`;
  })}</ul></nav>` : ``}`;
});
export { PostsList as P, Pagination as a };
