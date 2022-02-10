import { p as postsPerPage } from "./config-52afe4d0.js";
const fetchPosts = async ({ offset = 0, limit = postsPerPage, category = "" } = {}) => {
  const posts = await Promise.all(Object.entries({ "../../posts/heading-links-example.md": () => import("./heading-links-example-0aa2c4f0.js"), "../../posts/mdsvex-component-example.md": () => import("./mdsvex-component-example-ce2c5870.js"), "../../posts/syntax-highlighting-example.md": () => import("./syntax-highlighting-example-6a085818.js") }).map(async ([path, resolver]) => {
    const { metadata } = await resolver();
    const slug = path.split("/").pop().slice(0, -3);
    return { ...metadata, slug };
  }));
  let sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (category) {
    sortedPosts = sortedPosts.filter((post) => post.categories.includes(category));
  }
  if (offset) {
    sortedPosts = sortedPosts.slice(offset);
  }
  if (limit && limit < sortedPosts.length && limit != -1) {
    sortedPosts = sortedPosts.slice(0, limit);
  }
  sortedPosts = sortedPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverWidth: post.coverWidth,
    coverHeight: post.coverHeight,
    date: post.date,
    categories: post.categories
  }));
  return {
    posts: sortedPosts
  };
};
export { fetchPosts as f };
