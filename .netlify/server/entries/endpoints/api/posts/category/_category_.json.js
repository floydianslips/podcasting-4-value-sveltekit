import { f as fetchPosts } from "../../../../../chunks/fetchPosts-e9d9b191.js";
import "../../../../../chunks/config-b9ab5e02.js";
const get = async ({ params }) => {
  const { category } = params;
  try {
    const { posts } = await fetchPosts({ category });
    return {
      status: 200,
      body: {
        posts
      }
    };
  } catch {
    return {
      status: 500,
      body: {
        error: `Could not retrieve total number of ${category} posts.`
      }
    };
  }
};
export { get };
