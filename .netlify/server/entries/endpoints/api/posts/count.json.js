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
  get: () => get
});
const get = async () => {
  try {
    const posts = { "../../../lib/posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require("../../../../chunks/heading-links-example-0aa2c4f0.js"))), "../../../lib/posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require("../../../../chunks/mdsvex-component-example-ce2c5870.js"))), "../../../lib/posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require("../../../../chunks/syntax-highlighting-example-6a085818.js"))) };
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
