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
  default: () => U5Bpostu5D,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../../chunks/index-44b51311.js"));
function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case "../../lib/posts/heading-links-example.md":
      return Promise.resolve().then(() => __toModule(require("../../../chunks/heading-links-example-0aa2c4f0.js")));
    case "../../lib/posts/mdsvex-component-example.md":
      return Promise.resolve().then(() => __toModule(require("../../../chunks/mdsvex-component-example-ce2c5870.js")));
    case "../../lib/posts/syntax-highlighting-example.md":
      return Promise.resolve().then(() => __toModule(require("../../../chunks/syntax-highlighting-example-6a085818.js")));
    default:
      return new Promise(function(resolve, reject) {
        (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
      });
  }
}
const load = async ({ params }) => {
  try {
    const post = await __variableDynamicImportRuntime0__(`../../lib/posts/${params.post}.md`);
    return {
      props: {
        PostContent: post.default,
        meta: __spreadProps(__spreadValues({}, post.metadata), { slug: params.post })
      }
    };
  } catch (error) {
    return { status: 404, error: error.message };
  }
};
const U5Bpostu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let { PostContent } = $$props;
  let { meta } = $$props;
  const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } = meta;
  if ($$props.PostContent === void 0 && $$bindings.PostContent && PostContent !== void 0)
    $$bindings.PostContent(PostContent);
  if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
    $$bindings.meta(meta);
  return `







${$$result.head += `${$$result.title = `<title>${(0, import_index_44b51311.g)(title)}</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-fsc2lq"><meta property="${"og:title"}"${(0, import_index_44b51311.d)("content", title, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:title"}"${(0, import_index_44b51311.d)("content", title, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:width"}"${(0, import_index_44b51311.d)("content", coverWidth, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:height"}"${(0, import_index_44b51311.d)("content", coverHeight, 0)} data-svelte="svelte-fsc2lq">`, ""}


<article class="${"post"}">
  <img class="${"cover-image"}"${(0, import_index_44b51311.d)("src", coverImage, 0)} alt="${""}" style="${"aspect-ratio: " + (0, import_index_44b51311.g)(coverWidth) + " / " + (0, import_index_44b51311.g)(coverHeight) + ";"}"${(0, import_index_44b51311.d)("width", coverWidth, 0)}${(0, import_index_44b51311.d)("height", coverHeight, 0)}>

  <h1>${(0, import_index_44b51311.g)(title)}</h1>
  
  <div class="${"meta"}"><b>Published:</b> ${(0, import_index_44b51311.g)(date)}
    <br>
    <b>Updated:</b> ${(0, import_index_44b51311.g)(updated)}</div>
  
  ${(0, import_index_44b51311.v)(PostContent || import_index_44b51311.m, "svelte:component").$$render($$result, {}, {}, {})}

  ${categories ? `<aside class="${"post-footer"}"><h2>Posted in: </h2>
      <ul>${(0, import_index_44b51311.f)(categories, (category) => {
    return `<li><a href="${"/blog/category/" + (0, import_index_44b51311.g)(category) + "/"}">${(0, import_index_44b51311.g)(category)}</a>
          </li>`;
  })}</ul></aside>` : ``}</article>`;
});
