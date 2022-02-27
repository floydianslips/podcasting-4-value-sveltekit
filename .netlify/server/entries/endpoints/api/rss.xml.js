import { s as siteTitle, a as siteDescription, b as siteLink, c as siteURL } from "../../../chunks/config-702cd8c2.js";
const get = async () => {
  const data = await Promise.all(Object.entries({ "../../lib/posts/added-new-netlify-cms.md": () => import("../../../chunks/added-new-netlify-cms-fb469ce3.js"), "../../lib/posts/heading-links-example.md": () => import("../../../chunks/heading-links-example-b9f4cd78.js"), "../../lib/posts/mdsvex-component-example.md": () => import("../../../chunks/mdsvex-component-example-61ba3f85.js"), "../../lib/posts/syntax-highlighting-example.md": () => import("../../../chunks/syntax-highlighting-example-59d1c06d.js") }).map(async ([path, page]) => {
    const { metadata } = await page();
    const slug = path.split("/").pop().split(".").shift();
    return { ...metadata, slug };
  })).then((posts) => {
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  const body = render(data);
  const headers = {
    "Cache-Control": `max-age=0, s-max-age=${600}`,
    "Content-Type": "application/xml"
  };
  return {
    body,
    headers
  };
};
const render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteLink}</link>
<atom:link href="https://${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item>
<guid isPermaLink="true">https://${siteURL}/blog/${post.slug}</guid>
<title>${post.title}</title>
<link>https://${siteURL}/blog/${post.slug}</link>
<description>${post.excerpt}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join("")}
</channel>
</rss>
`;
export { get };
