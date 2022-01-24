var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  default: () => U5Bpageu5D,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../../../../chunks/index-44b51311.js"));
var import_fetchPosts_e339a40a = __toModule(require("../../../../../chunks/fetchPosts-e339a40a.js"));
var import_config_51b2cd5b = __toModule(require("../../../../../chunks/config-51b2cd5b.js"));
var import_Pagination_a710c3a2 = __toModule(require("../../../../../chunks/Pagination-a710c3a2.js"));
const load = async ({ fetch, params }) => {
  try {
    const page = params.page ? params.page : 1;
    if (page <= 1) {
      return { status: 301, redirect: "/blog" };
    }
    let offset = page * import_config_51b2cd5b.p - import_config_51b2cd5b.p;
    const totalPostsRes = await fetch("/api/posts/count.json");
    const { total } = await totalPostsRes.json();
    const { posts } = await (0, import_fetchPosts_e339a40a.f)({ offset, page });
    return {
      status: 200,
      props: { posts, page, totalPosts: total }
    };
  } catch (error) {
    return { status: 404, error: error.message };
  }
};
const U5Bpageu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let lowerBound;
  let upperBound;
  let { page } = $$props;
  let { totalPosts } = $$props;
  let { posts = [] } = $$props;
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
    $$bindings.totalPosts(totalPosts);
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  lowerBound = page * import_config_51b2cd5b.p - (import_config_51b2cd5b.p - 1) || 1;
  upperBound = Math.min(page * import_config_51b2cd5b.p, totalPosts);
  return `







${$$result.head += `${$$result.title = `<title>Blog - page ${(0, import_index_44b51311.g)(page)}</title>`, ""}<meta data-key="${"description"}"${(0, import_index_44b51311.d)("name", import_config_51b2cd5b.a, 0)} data-svelte="svelte-1qczpud">`, ""}



${posts.length ? `<h1>Posts ${(0, import_index_44b51311.g)(lowerBound)}\u2013${(0, import_index_44b51311.g)(upperBound)} of ${(0, import_index_44b51311.g)(totalPosts)}</h1>
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
});
