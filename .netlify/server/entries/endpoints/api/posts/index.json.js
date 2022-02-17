import { p as postsPerPage } from "../../../../chunks/config-b9ab5e02.js";
import { f as fetchPosts } from "../../../../chunks/fetchPosts-e9d9b191.js";
const get = async ({ url }) => {
  try {
    const params = new URLSearchParams(url.search);
    const options = {
      offset: parseInt(params.get("offset")) || null,
      limit: parseInt(params.get("limit")) || postsPerPage
    };
    const { posts } = await fetchPosts(options);
    return {
      status: 200,
      body: {
        posts
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "Could not fetch posts. " + error
      }
    };
  }
};
export { get };
