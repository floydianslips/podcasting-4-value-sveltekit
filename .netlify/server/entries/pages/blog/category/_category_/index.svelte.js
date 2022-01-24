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
  default: () => U5Bcategoryu5D,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../../../../chunks/index-44b51311.js"));
var import_fetchPosts_e339a40a = __toModule(require("../../../../../chunks/fetchPosts-e339a40a.js"));
var import_Pagination_a710c3a2 = __toModule(require("../../../../../chunks/Pagination-a710c3a2.js"));
var import_config_51b2cd5b = __toModule(require("../../../../../chunks/config-51b2cd5b.js"));
const load = async ({ params, fetch }) => {
  const category = params.category;
  const options = { category };
  const { posts } = await (0, import_fetchPosts_e339a40a.f)(options);
  const res = await fetch(`/api/posts/category/${category}/count.json`);
  const { total } = await res.json();
  return { props: { posts, category, total } };
};
const U5Bcategoryu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let { posts } = $$props;
  let { category } = $$props;
  let { total } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0)
    $$bindings.total(total);
  return `






${$$result.head += `${$$result.title = `<title>Category: ${(0, import_index_44b51311.g)(category)}</title>`, ""}`, ""}


<h1>Blog category: ${(0, import_index_44b51311.g)(category)}</h1>

${posts.length ? `${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, {
    currentPage: "1",
    totalPosts: total,
    path: "/blog/category/" + category + "/page"
  }, {}, {})}` : `<p><strong>Ope!</strong> Sorry, couldn&#39;t find any posts in the category &quot;${(0, import_index_44b51311.g)(category)}&quot;.</p>

  <p><a href="${"/blog"}">Back to blog</a></p>`}`;
});
