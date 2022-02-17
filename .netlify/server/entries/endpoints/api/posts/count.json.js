const get = async () => {
  try {
    const posts = { "../../../lib/posts/added-new-netlify-cms.md": () => import("../../../../chunks/added-new-netlify-cms-fb469ce3.js"), "../../../lib/posts/heading-links-example.md": () => import("../../../../chunks/heading-links-example-b9f4cd78.js"), "../../../lib/posts/mdsvex-component-example.md": () => import("../../../../chunks/mdsvex-component-example-61ba3f85.js"), "../../../lib/posts/syntax-highlighting-example.md": () => import("../../../../chunks/syntax-highlighting-example-59d1c06d.js") };
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
