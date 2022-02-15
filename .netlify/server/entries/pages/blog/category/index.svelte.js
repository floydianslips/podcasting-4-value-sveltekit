import { c as create_ssr_component, f as each, g as escape } from "../../../../chunks/index-44b51311.js";
const load = async ({ fetch }) => {
  const res = await fetch(`/api/posts.json`);
  let { posts } = await res.json();
  let uniqueCategories = {};
  posts.forEach((post) => {
    post.categories.forEach((category) => {
      if (uniqueCategories.hasOwnProperty(category)) {
        uniqueCategories[category].count += 1;
      } else {
        uniqueCategories[category] = { title: category, count: 1 };
      }
    });
  });
  const sortedUniqueCategories = Object.values(uniqueCategories).sort((a, b) => a.title > b.title);
  return {
    props: { uniqueCategories: sortedUniqueCategories }
  };
};
const Category = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { uniqueCategories } = $$props;
  if ($$props.uniqueCategories === void 0 && $$bindings.uniqueCategories && uniqueCategories !== void 0)
    $$bindings.uniqueCategories(uniqueCategories);
  return `${$$result.head += `${$$result.title = `<title>Blog | Categories</title>`, ""}`, ""}


<div class="${"compressed-content"}"><h1 class="${"h2"}">All blog categories</h1>
  
  <ul>${each(uniqueCategories, (category) => {
    return `<li><a href="${"/blog/category/" + escape(category.title)}">${escape(category.title)}</a>
      (${escape(category.count)})
    </li>`;
  })}</ul></div>`;
});
export { Category as default, load };
