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
  default: () => Category,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../../../chunks/index-44b51311.js"));
const load = async ({ fetch }) => {
  const res = await fetch(`/api/posts.json`);
  let { posts } = await res.json();
  let uniqueCategories = {};
  posts.forEach((post) => {
    post.categories.forEach((category) => {
      if (uniqueCategories.hasOwnProperty(category)) {
        uniqueCategories[category].count += 1;
      } else {
        uniqueCategories[category] = { title: category, count: 1 };
      }
    });
  });
  const sortedUniqueCategories = Object.values(uniqueCategories).sort((a, b) => a.title > b.title);
  return {
    props: { uniqueCategories: sortedUniqueCategories }
  };
};
const Category = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let { uniqueCategories } = $$props;
  if ($$props.uniqueCategories === void 0 && $$bindings.uniqueCategories && uniqueCategories !== void 0)
    $$bindings.uniqueCategories(uniqueCategories);
  return `${$$result.head += `${$$result.title = `<title>Blog | Categories</title>`, ""}`, ""}


<div class="${"compressed-content"}"><h1 class="${"h2"}">All blog categories</h1>
  
  <ul>${(0, import_index_44b51311.f)(uniqueCategories, (category) => {
    return `<li><a href="${"/blog/category/" + (0, import_index_44b51311.g)(category.title)}">${(0, import_index_44b51311.g)(category.title)}</a>
      (${(0, import_index_44b51311.g)(category.count)})
    </li>`;
  })}</ul></div>`;
});
