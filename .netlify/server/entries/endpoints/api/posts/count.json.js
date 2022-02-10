const get = async () => {
  try {
    const posts = { "../../../lib/posts/heading-links-example.md": () => import("../../../../chunks/heading-links-example-0aa2c4f0.js"), "../../../lib/posts/mdsvex-component-example.md": () => import("../../../../chunks/mdsvex-component-example-ce2c5870.js"), "../../../lib/posts/syntax-highlighting-example.md": () => import("../../../../chunks/syntax-highlighting-example-6a085818.js") };
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
