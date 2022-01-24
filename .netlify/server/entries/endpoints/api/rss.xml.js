var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  get: () => get
});
var import_config_51b2cd5b = __toModule(require("../../../chunks/config-51b2cd5b.js"));
const get = async () => {
  const data = await Promise.all(Object.entries({ "../../lib/posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require("../../../chunks/heading-links-example-0aa2c4f0.js"))), "../../lib/posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require("../../../chunks/mdsvex-component-example-ce2c5870.js"))), "../../lib/posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require("../../../chunks/syntax-highlighting-example-6a085818.js"))) }).map(async ([path, page]) => {
    const { metadata } = await page();
    const slug = path.split("/").pop().split(".").shift();
    return __spreadProps(__spreadValues({}, metadata), { slug });
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
<title>${import_config_51b2cd5b.s}</title>
<description>${import_config_51b2cd5b.a}</description>
<link>${import_config_51b2cd5b.b}</link>
<atom:link href="https://${import_config_51b2cd5b.c}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item>
<guid isPermaLink="true">https://${import_config_51b2cd5b.c}/blog/${post.slug}</guid>
<title>${post.title}</title>
<link>https://${import_config_51b2cd5b.c}/blog/${post.slug}</link>
<description>${post.excerpt}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join("")}
</channel>
</rss>
`;
