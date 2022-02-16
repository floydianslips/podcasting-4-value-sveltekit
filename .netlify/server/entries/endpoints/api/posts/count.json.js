const get = async () => {
  try {
    const posts = { "../../../lib/posts/heading-links-example.md": () => import("../../../../chunks/heading-links-example-021e5e15.js"), "../../../lib/posts/mdsvex-component-example.md": () => import("../../../../chunks/mdsvex-component-example-f59ab75d.js"), "../../../lib/posts/syntax-highlighting-example.md": () => import("../../../../chunks/syntax-highlighting-example-3c01966e.js") };
    return {
      status: 200,
      body: {
        total: Object.keys(posts).length
      }
    };
  } catch {
    return {
      status: 500,
      body: {
        error: "Could not retrieve total number of posts."
      }
    };
  }
};
export { get };
