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
  f: () => fetchPosts
});
var import_config_51b2cd5b = __toModule(require("./config-51b2cd5b.js"));
const fetchPosts = async ({ offset = 0, limit = import_config_51b2cd5b.p, category = "" } = {}) => {
  const posts = await Promise.all(Object.entries({ "../../posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require("./heading-links-example-0aa2c4f0.js"))), "../../posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require("./mdsvex-component-example-ce2c5870.js"))), "../../posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require("./syntax-highlighting-example-6a085818.js"))) }).map(async ([path, resolver]) => {
    const { metadata } = await resolver();
    const slug = path.split("/").pop().slice(0, -3);
    return __spreadProps(__spreadValues({}, metadata), { slug });
  }));
  let sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (category) {
    sortedPosts = sortedPosts.filter((post) => post.categories.includes(category));
  }
  if (offset) {
    sortedPosts = sortedPosts.slice(offset);
  }
  if (limit && limit < sortedPosts.length && limit != -1) {
    sortedPosts = sortedPosts.slice(0, limit);
  }
  sortedPosts = sortedPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverWidth: post.coverWidth,
    coverHeight: post.coverHeight,
    date: post.date,
    categories: post.categories
  }));
  return {
    posts: sortedPosts
  };
};
