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
  P: () => PostsList,
  a: () => Pagination
});
var import_index_44b51311 = __toModule(require("./index-44b51311.js"));
var import_config_51b2cd5b = __toModule(require("./config-51b2cd5b.js"));
const PostsList = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  return `<ul class="${"posts-list"}">${(0, import_index_44b51311.f)(posts, (post) => {
    return `<li><article><a href="${"/blog/" + (0, import_index_44b51311.g)(post.slug)}"><img${(0, import_index_44b51311.d)("src", post.coverImage, 0)} alt="${""}"${(0, import_index_44b51311.d)("width", post.coverWidth, 0)}${(0, import_index_44b51311.d)("height", post.coverHeight, 0)} style="${"ratio: " + (0, import_index_44b51311.g)(post.coverWidth) + " / " + (0, import_index_44b51311.g)(post.coverHeight)}">
          <h2>${(0, import_index_44b51311.g)(post.title)}</h2>
        </a></article>

      <p>${(0, import_index_44b51311.g)(post.excerpt)}</p>
    </li>`;
  })}</ul>`;
});
const Pagination = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let { currentPage } = $$props;
  let { totalPosts } = $$props;
  let { path = "/blog/page" } = $$props;
  let pagesAvailable;
  const isCurrentPage = (page) => page == currentPage;
  if ($$props.currentPage === void 0 && $$bindings.currentPage && currentPage !== void 0)
    $$bindings.currentPage(currentPage);
  if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
    $$bindings.totalPosts(totalPosts);
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  pagesAvailable = Math.ceil(totalPosts / import_config_51b2cd5b.p);
  return `
${pagesAvailable > 1 ? `<nav aria-label="${"Pagination navigation"}" class="${"pagination"}"><ul>${(0, import_index_44b51311.f)(Array.from({ length: pagesAvailable }, (_, i) => i + 1), (page) => {
    return `<li><a href="${(0, import_index_44b51311.g)(path) + "/" + (0, import_index_44b51311.g)(page)}"${(0, import_index_44b51311.d)("aria-current", isCurrentPage(page), 0)}><span class="${"sr-only"}">${isCurrentPage(page) ? `Current page:` : `Go to page`}</span>
              ${(0, import_index_44b51311.g)(page)}</a>
          </li>`;
  })}</ul></nav>` : ``}`;
});
